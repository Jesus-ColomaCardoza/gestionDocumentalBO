import { Dialog } from "primereact/dialog";

import { Button } from "primereact/button";
import {
  Tree,
  TreeCheckboxSelectionKeys,
  TreeExpandedKeysType,
  TreeMultipleSelectionKeys,
} from "primereact/tree";
import { Dispatch, SetStateAction, useState } from "react";
import { TreeNode } from "primereact/treenode";
import { Dropdown } from "primereact/dropdown";
import { CarpetaCombinationsFilters } from "../../carpeta/interfaces/CarpetaInterface";
import { FileManagerEntity } from "../interfaces/FileMangerInterface";

type FileManagerMoveProps = {
  usuario: {
    IdUsuario: number;
    IdArea: number;
  };
  fileManager: FileManagerEntity;
  carpetas: any;
  selectedFileMoved:
    | string
    | TreeMultipleSelectionKeys
    | TreeCheckboxSelectionKeys
    | null;
  setSelectedFileMoved: Dispatch<
    SetStateAction<
      string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null
    >
  >;
  moveFileManagerDialog: boolean;
  hideDialog: () => void;
  moveFileManager: (categoria: "MF" | "FA" | "FS") => Promise<void>;
  loadingFileManagerMove: boolean;
  findAllTreeFileManager: (
    fileManagerGetTree: CarpetaCombinationsFilters
  ) => Promise<void>;
};

const FileManagerMove = (props: FileManagerMoveProps) => {
  const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>();

  const [selectedTitleFM, setSelectedTitleFM] = useState<{
    id: "MF" | "FA" | "FS";
    title: string | undefined;
  } | null>();

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of props.carpetas) {
      expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
  };

  const collapseAll = () => {
    setSelectedTitleFM(null);
    setExpandedKeys({});
  };

  const expandNode = (node: TreeNode, _expandedKeys: TreeExpandedKeysType) => {
    if (node.children && node.children.length) {
      if (node.key) {
        _expandedKeys[node.key] = true;
      }

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  return (
    <Dialog
      visible={props.moveFileManagerDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Mover carpeta"
      modal
      className="p-fluid"
      footer={
        <>
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => {
              props.hideDialog();
              collapseAll();
            }}
          />
          <Button
            loading={props.loadingFileManagerMove}
            label="Mover"
            icon="pi pi-check"
            onClick={() => {
              props.moveFileManager(selectedTitleFM?.id!);
              collapseAll();
            }}
          />
        </>
      }
      onHide={() => {
        props.hideDialog();
        collapseAll();
      }}
    >
      <div
        className="flex align-items-center gap-2 pb-2"
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "var(--surface-card)",
          zIndex: 1000,
        }}
      >
        <Dropdown
          value={selectedTitleFM}
          onChange={async (e) => {
            setSelectedTitleFM(e.value);
            setExpandedKeys({});
            props.setSelectedFileMoved(null);
            await props.findAllTreeFileManager({
              cantidad_max: "0",
              Language: "ES",
              filters: [
                {
                  campo: "Categoria",
                  operador: "EQ",
                  tipo: "string",
                  valor1: `${e.value.id}`,
                  valor2: "",
                },
              ],
              CustomIcon: "pi pi-folder",
              IdArea: props.usuario.IdArea,
              NotIncludeIdCarpeta: parseInt(
                props.fileManager.IdFM.split("_")[1]
              ),
            });
          }}
          options={[
            { id: "MF", title: "Mis archivos" },
            { id: "FA", title: "Archivos de área" },
            { id: "FS", title: "Compartidos conmigo" },
          ]}
          optionLabel="title"
          placeholder="Seleccionar Destino"
          className="w-full"
        />
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            icon="pi pi-plus"
            // label="Expand All"
            onClick={expandAll}
            className="w-1 py-1 px-3"
          />
          <Button
            type="button"
            icon="pi pi-minus"
            // label="Collapse All"
            onClick={collapseAll}
            className="w-1 py-1 px-3"
          />
        </div>
      </div>

      <Tree
        value={props.carpetas}
        selectionMode="single"
        selectionKeys={props.selectedFileMoved}
        onSelectionChange={(e) => props.setSelectedFileMoved(e.value)}
        expandedKeys={expandedKeys}
        onToggle={(e) => setExpandedKeys(e.value)}
        emptyMessage={
          <div style={{ width: "100%", textAlign: "center" }}>
            No hay carpetas disponibles
          </div>
        }
      />
    </Dialog>
  );
};

export default FileManagerMove;
