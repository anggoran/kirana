import "@cloudscape-design/global-styles/index.css";
import { AppLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import SideBar from "./views/components/SideBar";
import ReactDOM from "react-dom";
import CreatePage from "./views/pages/create";
import { StrictMode } from "react";

export default function App() {
  return (
    <StrictMode>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "/" },
              { text: "Create Analysis", href: "/create" },
            ]}
          />
        }
        navigation={<SideBar />}
        content={<CreatePage />}
        toolsHide
        navigationHide
      />
    </StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
