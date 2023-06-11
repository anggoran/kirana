import { Table, Pagination, FileUpload } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useState } from "react";
import { Observations, ResearchModel } from "../../models/research-model";
import { handleCSV } from "../../controllers/research-controller";
import { DSVRowString } from "d3";
import { paginate } from "../../utils/pagination";

export default ({
  observations,
  setObservations,
  research,
  setResearch,
}: {
  observations: Observations | undefined;
  setObservations: Dispatch<SetStateAction<Observations | undefined>>;
  research: ResearchModel;
  setResearch: Dispatch<SetStateAction<ResearchModel>>;
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { items, totalPages } = paginate(observations, page, 10);

  const handleObservations = (observations: Observations | undefined) => {
    if (observations === undefined) return [];

    const { columns } = observations;
    return columns.map((e) => ({
      header: e,
      cell: (item: DSVRowString) => item[e],
      width: 200,
    }));
  };

  return (
    <>
      <Table
        columnDefinitions={handleObservations(observations)}
        items={items}
        sortingDisabled
        stripedRows
        stickyHeader
        variant="container"
        pagination={
          observations ? (
            <Pagination
              currentPageIndex={page}
              pagesCount={totalPages}
              onChange={({ detail }) => setPage(detail.currentPageIndex)}
            />
          ) : null
        }
        loadingText="Loading observations"
        loading={loading}
        empty={
          <FileUpload
            accept=".csv"
            onChange={({ detail }) => {
              setLoading(true);
              handleCSV(detail.value[0], research, setResearch)
                .then((value) => setObservations(value))
                .then(() => setLoading(false));
            }}
            value={[]}
            showFileSize
            showFileLastModified
            i18nStrings={{
              uploadButtonText: () => "Upload file",
              dropzoneText: () => "Drop file to upload",
              removeFileAriaLabel: () => "Remove file",
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
              formatFileLastModified: (e) =>
                e.toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                }),
            }}
          />
        }
      />
    </>
  );
};
