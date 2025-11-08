#!/usr/bin/env node

/**
 * Script สำหรับ pre-generate static JSON data
 * รันด้วย: node scripts/generate-data.mjs
 * หรือเพิ่มใน package.json: "generate:data": "node scripts/generate-data.mjs"
 */

const GRAPHQL_ENDPOINT = "https://politigraph.wevis.info/graphql";

/**
 * ดึงข้อมูลจาก GraphQL
 */
async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching GraphQL:", error);
    throw error;
  }
}

/**
 * สร้างข้อมูล Action Summary (data.json)
 */
async function generateActionSummary() {
  console.log("🔄 Generating MP Action Summary...");

  const query = `
    query ($where: OrganizationWhere) {
      people(limit: 1000) {
        name
        image
        memberships {
          province
          label
          end_date
        }
        votes {
          option
          vote_events {
            title
            result
            organizations(where: $where) {
              name
              term
            }
          }
        }
      }
    }
  `;

  const variables = {
    where: {
      classification_EQ: "HOUSE_OF_REPRESENTATIVE",
    },
  };

  const data = await fetchGraphQL(query, variables);

  if (!data?.people) {
    throw new Error("No people data received");
  }

  const mpStatsMap = new Map();

  for (const person of data.people) {
    const activeMemberships = person.memberships?.filter(
      (m) => m.province && m.label === "แบ่งเขต" && m.end_date === null
    );
    const province = activeMemberships?.[0]?.province || null;

    if (!mpStatsMap.has(person.name)) {
      mpStatsMap.set(person.name, {
        person: person.name,
        province,
        image: person.image || null,
        งดออกเสียง: 0,
        "ลา / ขาดลงมติ": 0,
        เห็นด้วย: 0,
        ไม่ลงคะแนนเสียง: 0,
        ไม่เห็นด้วย: 0,
        รวมลงมติ: 0,
      });
    }

    const stats = mpStatsMap.get(person.name);

    for (const vote of person.votes || []) {
      for (const voteEvent of vote.vote_events || []) {
        const isTerm26 = voteEvent.organizations?.some(
          (org) => org.term === 26
        );

        if (!isTerm26) continue;

        const option = vote.option;

        if (option === "งดออกเสียง") {
          stats.งดออกเสียง++;
        } else if (option === "ลา / ขาดลงมติ") {
          stats["ลา / ขาดลงมติ"]++;
        } else if (option === "เห็นด้วย") {
          stats.เห็นด้วย++;
          stats.รวมลงมติ++;
        } else if (option === "ไม่ลงคะแนนเสียง") {
          stats.ไม่ลงคะแนนเสียง++;
        } else if (option === "ไม่เห็นด้วย") {
          stats.ไม่เห็นด้วย++;
          stats.รวมลงมติ++;
        }
      }
    }
  }

  const result = Array.from(mpStatsMap.values());
  console.log(`✅ Generated ${result.length} MP records`);
  return result;
}

/**
 * สร้างข้อมูล Bill Vote Details (bill.json)
 */
async function generateBillVoteDetails() {
  console.log("🔄 Generating Bill Vote Details...");

  const query = `
    query ($where: OrganizationWhere) {
      people(limit: 1000) {
        name
        memberships {
          province
          label
          end_date
        }
        votes {
          option
          vote_events {
            title
            result
            organizations(where: $where) {
              name
              term
            }
          }
        }
      }
    }
  `;

  const variables = {
    where: {
      classification_EQ: "HOUSE_OF_REPRESENTATIVE",
    },
  };

  const data = await fetchGraphQL(query, variables);

  if (!data?.people) {
    throw new Error("No people data received");
  }

  const records = [];

  for (const person of data.people) {
    const activeMemberships = person.memberships?.filter(
      (m) => m.province && m.label === "แบ่งเขต" && m.end_date === null
    );
    const province = activeMemberships?.[0]?.province || null;

    for (const vote of person.votes || []) {
      for (const voteEvent of vote.vote_events || []) {
        const isTerm26 = voteEvent.organizations?.some(
          (org) => org.term === 26
        );

        if (!isTerm26) continue;

        records.push({
          person: person.name,
          province,
          option: vote.option,
          law: voteEvent.title,
          result: voteEvent.result || null,
        });
      }
    }
  }

  console.log(`✅ Generated ${records.length} vote records`);
  return records;
}

/**
 * Main function
 */
async function main() {
  const fs = await import("fs/promises");
  const path = await import("path");

  console.log("🚀 Starting data generation...\n");

  try {
    // สร้าง public/data directory ถ้ายังไม่มี
    const dataDir = path.join(process.cwd(), "public", "data");
    await fs.mkdir(dataDir, { recursive: true });

    // Generate Action Summary
    const actionSummary = await generateActionSummary();
    const actionPath = path.join(dataDir, "mp-action-summary.json");
    await fs.writeFile(
      actionPath,
      JSON.stringify(actionSummary, null, 2),
      "utf-8"
    );
    console.log(`📝 Saved to: ${actionPath}\n`);

    // Generate Bill Vote Details
    const billDetails = await generateBillVoteDetails();
    const billPath = path.join(dataDir, "bill-vote-details.json");
    await fs.writeFile(billPath, JSON.stringify(billDetails, null, 2), "utf-8");
    console.log(`📝 Saved to: ${billPath}\n`);

    // สร้างสถิติเพิ่มเติม
    const provinceStats = {};
    for (const mp of actionSummary) {
      if (!mp.province) continue;
      if (!provinceStats[mp.province]) {
        provinceStats[mp.province] = [];
      }
      provinceStats[mp.province].push(mp);
    }

    const provinceSummary = {};
    for (const [province, mps] of Object.entries(provinceStats)) {
      const totalMPs = mps.length;
      provinceSummary[province] = {
        totalMPs,
        avgAgree:
          Math.round(
            (mps.reduce((sum, mp) => sum + mp.เห็นด้วย, 0) / totalMPs) * 100
          ) / 100,
        avgDisagree:
          Math.round(
            (mps.reduce((sum, mp) => sum + mp.ไม่เห็นด้วย, 0) / totalMPs) * 100
          ) / 100,
        avgAbstain:
          Math.round(
            (mps.reduce((sum, mp) => sum + mp.งดออกเสียง, 0) / totalMPs) * 100
          ) / 100,
        avgAbsent:
          Math.round(
            (mps.reduce((sum, mp) => sum + mp["ลา / ขาดลงมติ"], 0) / totalMPs) *
              100
          ) / 100,
      };
    }

    const provincePath = path.join(dataDir, "province-summary.json");
    await fs.writeFile(
      provincePath,
      JSON.stringify(provinceSummary, null, 2),
      "utf-8"
    );
    console.log(`📝 Saved to: ${provincePath}\n`);

    console.log("✨ Data generation completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
