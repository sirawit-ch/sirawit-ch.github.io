import json
import requests
import pandas as pd

url = "https://politigraph.wevis.info/graphql"

query = """
query ($where: OrganizationWhere){
  people {
    name
    image
    memberships {
      province
    }
    votes {
      option
      vote_events {
        title
        result
        organizations (where: $where){
          name
          term
        }
      }
    }
  }
}
"""
variables = {
  "where": {
    "classification_EQ": "HOUSE_OF_REPRESENTATIVE"
  }
}

response = requests.post(url, json={"query": query,"variables":variables}).json()
people = response["data"]["people"]

records = []

for p in people:
    provinces = [m.get("province") for m in p.get("memberships", []) if m.get("province")]
    province = provinces[-1] if provinces else None
    for v in p["votes"]:
        if v["option"] not in ["นายชัยเกษม นิติสิริ", "นายอนุทิน ชาญวีรกูล"]:
            for e in v["vote_events"]:
                for org in e["organizations"]:
                    if org["term"] == 26:
                        records.append({
                            "person": p["name"],
                            "province": province,
                            "option": v["option"],
                            "law": e["title"],
                            "result":e["result"],
                            "organization": org["name"],
                            "term": org["term"],
                            "image": p["image"]
                        })

df = pd.DataFrame(records)
#summary
table = pd.crosstab(df["person"], df["option"])
table["รวมลงมติ"] = table.drop(columns="ลา / ขาดลงมติ").sum(axis=1)
table["ลา / ขาดลงมติ"] = table["ลา / ขาดลงมติ"]

info = df[["person", "province", "image"]].drop_duplicates("person")

summary_df = table.reset_index().merge(info, on="person", how="left")

summary_dict = summary_df.to_dict(orient="records")

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(summary_dict, f, indent=2, ensure_ascii=False)

#result
df = pd.DataFrame(records)
info_law = df[["person","province","option","law","result"]]
summary_dict = info_law.to_dict(orient="records")

with open("bill.json","w",encoding="utf-8") as f:
    json.dump(summary_dict,f,indent=2,ensure_ascii=False)
