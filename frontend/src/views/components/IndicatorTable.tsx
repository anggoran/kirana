import {
  Table,
  Box,
  Input,
  Select,
  CollectionPreferences,
} from "@cloudscape-design/components";
import {
  ResearchModel,
  IndicatorRole,
  IndicatorType,
} from "../../models/research-model";
import { Dispatch, SetStateAction } from "react";
import { tableID } from "../../utils/names";
import {
  handleIndicatorPreferences,
  handleIndicatorProps,
} from "../../controllers/research-controller";

export default ({
  research,
  setResearch,
}: {
  research: ResearchModel;
  setResearch: Dispatch<SetStateAction<ResearchModel>>;
}) => {
  const typeOptions = Object.values(IndicatorType).map((e) => ({ value: e }));
  const roleOptions = Object.values(IndicatorRole).map((e) => ({ value: e }));

  return (
    <>
      <Table
        items={research.indicators.filter((e) => e.visibility)}
        sortingDisabled
        stripedRows
        stickyHeader
        loadingText="Loading resources"
        variant="container"
        submitEdit={(item, column, newValue) => {
          handleIndicatorProps(item, column, newValue, research, setResearch);
        }}
        empty={
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No data to display.
          </Box>
        }
        header={
          <Box float="right">
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                contentDisplay: research.indicators.map((e) => ({
                  id: (e.id ?? e.order).toString(),
                  visible: e.visibility,
                })),
              }}
              contentDisplayPreference={{
                title: "Order & Visibility",
                description:
                  "Reorder column with the icon and/or change visibility with the switch.",
                options: research.indicators.map((e) => ({
                  id: (e.id ?? e.order).toString(),
                  label: e.name,
                })),
              }}
              onConfirm={({ detail }) =>
                handleIndicatorPreferences(detail, research, setResearch)
              }
            />
          </Box>
        }
        columnDefinitions={[
          {
            id: tableID.name.toLowerCase(),
            header: tableID.name,
            width: 200,
            cell: (item) => {
              return item.name;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                return (
                  <Input
                    autoFocus={true}
                    value={currentValue ?? item.name}
                    onChange={(e) => setValue(e.detail.value)}
                  />
                );
              },
            },
          },
          {
            id: tableID.type.toLowerCase(),
            header: tableID.type,
            width: 200,
            cell: (item) => {
              return item.type;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                const value = currentValue ?? item.type;
                return (
                  <Select
                    autoFocus={true}
                    expandToViewport={true}
                    selectedOption={
                      typeOptions.find((e) => e.value === value) ?? null
                    }
                    onChange={(e) => {
                      setValue(e.detail.selectedOption.value ?? item.type);
                    }}
                    options={typeOptions}
                  />
                );
              },
            },
          },
          {
            id: tableID.role.toLowerCase(),
            header: tableID.role,
            width: 200,
            cell: (item) => {
              return item.role;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                const value = currentValue ?? item.role;
                return (
                  <Select
                    autoFocus={true}
                    expandToViewport={true}
                    selectedOption={
                      roleOptions.find((e) => e.value === value) ?? null
                    }
                    onChange={(e) => {
                      setValue(e.detail.selectedOption.value ?? item.role);
                    }}
                    options={roleOptions}
                  />
                );
              },
            },
          },
        ]}
      />
    </>
  );
};
