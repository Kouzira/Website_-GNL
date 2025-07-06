// src/components/Pagination.jsx
import React from "react";
import { Pagination as MuiPagination, Stack } from "@mui/material";

export default function Pagination({ page, count, onChange }) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
      <MuiPagination
        page={page}
        count={count}
        color="primary"
        onChange={(e, value) => onChange(value)}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
