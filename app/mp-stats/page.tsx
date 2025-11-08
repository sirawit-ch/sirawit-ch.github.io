import MPActionList from "@/components/MPActionList";
import { Box } from "@mui/material";

export default function MPStatsPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6DD5ED 0%, #2193B0 100%)",
        p: 3,
      }}
    >
      <MPActionList />
    </Box>
  );
}
