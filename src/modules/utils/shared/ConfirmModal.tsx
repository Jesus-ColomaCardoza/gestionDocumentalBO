import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

type ConfirmModalProps = {
  submitted: boolean;
  typeMessage:
    | "success"
    | "info"
    | "secondary"
    | "contrast"
    | "danger"
    | "warning"
    | "help";
  message: string;
  typeButton:
    | "success"
    | "info"
    | "secondary"
    | "contrast"
    | "danger"
    | "warning"
    | "help";
  titleModal: string;
  state: boolean;
  hideDialog: () => void;
  callBack: () => void;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  const dialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.submitted}
        label="Yes"
        icon="pi pi-check"
        severity={props.typeButton}
        onClick={props.callBack}
      />
    </>
  );

  const typeMessage = (type: string) => {
    switch (type) {
      case "info":
        return (
          <i className="pi pi-info-circle mr-3" style={{ fontSize: "2rem" }} />
        );
      case "danger":
        return (
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
        );
      case "warning":
        return (
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Dialog
      visible={props.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={props.titleModal}
      modal
      footer={dialogFooter}
      onHide={props.hideDialog}
    >
      <div className="flex align-items-center confirmation-content">
        {typeMessage(props.typeMessage)}
        <span>{props.message}</span>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
