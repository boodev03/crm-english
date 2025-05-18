import { Button, Code, Container, FileInput, Paper, Title } from "@mantine/core";
import { useState } from "react";

// import { enrollmentService } from "../../supabase/services/enrollment.service";
import { s3Service } from "../../supabase/services/s3.service";

export default function Test() {
  const [res, setRes] = useState<unknown>(null);
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  const handleClick = async () => {
    setRes(res);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setRes("No file selected");
      return;
    }
    console.log(file);
    try {
      const result = await s3Service.uploadFile(file);
      setRes(result);
    } catch (error) {
      setRes({ error: "Upload failed", details: error });
    }
  };

  const handleMultipleFileUpload = async () => {
    if (!files.length) {
      setRes("No files selected");
      return;
    }
    try {
      const result = await s3Service.uploadMultipleFiles(files);
      setRes(result);
    } catch (error) {
      setRes({ error: "Multiple upload failed", details: error });
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={3} mb="md">
        API Test
      </Title>
      <Button onClick={handleClick} mb="lg">
        Test
      </Button>

      <Title order={4} mt="xl" mb="md">Single File Upload</Title>
      <FileInput
        placeholder="Choose file"
        label="Upload single file"
        value={file}
        onChange={setFile}
        accept="image/*,.pdf,.doc,.docx"
      />
      <Button onClick={handleFileUpload} mb="lg">
        Upload File
      </Button>

      <Title order={4} mt="xl" mb="md">Multiple Files Upload</Title>
      <FileInput
        placeholder="Choose files"
        label="Upload multiple files"
        multiple
        value={files}
        onChange={setFiles}
        accept="image/*,.pdf,.doc,.docx"
      />
      <Button onClick={handleMultipleFileUpload} mb="lg">
        Upload Multiple Files
      </Button>
      
      <Paper p="md" withBorder mt="xl">
        <Title order={4} mb="sm">
          Kết quả:
        </Title>
        <Code
          block
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(res, null, 2)}
        </Code>
      </Paper>
    </Container>
  );
}
