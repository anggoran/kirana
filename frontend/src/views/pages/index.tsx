import { Button, TextInput, Text } from "@primer/react";
import { helloController } from "../../controllers/hello-controller";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const response = await helloController();
    setData(response);
    setLoading(false);
  };

  if (isLoading) return <Text as="p">please wait...</Text>;

  return (
    <div>
      <Button onClick={getData}>Hi Python</Button>
      <Text as="p" sx={{ fontWeight: "bold" }}>
        {data}
      </Text>
    </div>
  );
}
