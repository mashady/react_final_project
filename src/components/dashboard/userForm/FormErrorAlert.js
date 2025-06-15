const { Alert, AlertDescription } = require("@/components/ui/alert");

const FormErrorAlert = ({ message }) => (
  <Alert className="mt-1 border-red-200 bg-red-50">
    <AlertDescription className="text-red-600 text-sm">
      {message}
    </AlertDescription>
  </Alert>
);

export { FormErrorAlert };
