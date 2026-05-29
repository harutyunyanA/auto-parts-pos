import { useState } from "react";
import { Card, Button, Typography, Input, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useServerUrl, useSetServerUrl } from "../../store/useServerStore";
import { normalizeServerUrl } from "../../utils/serverUrl";

const { Title, Text } = Typography;

export default function ServerSetup() {
  const navigate = useNavigate();
  const current = useServerUrl();
  const setServerUrl = useSetServerUrl();
  const [value, setValue] = useState(current);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    const url = normalizeServerUrl(value);
    if (!url) {
      message.warning("Enter a server address");
      return;
    }
    setTesting(true);
    try {
      await fetch(`${url}/settings`, { method: "GET" });
      message.success(`Server reachable: ${url}`);
    } catch {
      message.error(`Server unreachable: ${url}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const url = normalizeServerUrl(value);
    if (!url) {
      message.warning("Enter a server address");
      return;
    }
    setServerUrl(url);
    message.success("Server address saved");
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 440 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
          Server Connection
        </Title>
        <Text type="secondary">
          Enter the IP address of the main computer (where the server and database run).
        </Text>
        <Input
          style={{ marginTop: 16 }}
          placeholder="192.168.1.50 or http://192.168.1.50:4000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={handleSave}
          autoFocus
        />
        <Space style={{ marginTop: 20, width: "100%", justifyContent: "flex-end" }}>
          <Button loading={testing} onClick={handleTest}>
            Test
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Space>
      </Card>
    </div>
  );
}
