import {Box, Card, CardContent, CardHeader} from "@mui/material";
import React from "react";
import {SignInFormContent} from "./SignInFormContent.tsx";

export type SignInFormProps = {
  onReady: () => any,
}

export function SignInForm(props: SignInFormProps) {
  return (
    <Box m={8}>
      <Card>
        <CardHeader title="Вход" />
        <CardContent>
          <SignInFormContent {...props} />
        </CardContent>
      </Card>
    </Box>
  );
}