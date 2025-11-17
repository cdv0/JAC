import { View, Text, Modal } from "react-native";
import NormalButton from "./NormalButton";

type DeleteModalProps = {
  visible: boolean; // Controls if the modal is shown
  setHide: (visible: boolean) => void;
  type: "vehicle" | "review" | "record";
  onConfirm: () => void;
};

const DeleteModal = ({ visible, setHide, type, onConfirm }: DeleteModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => setHide(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-8/12 bg-white rounded-xl p-5">
          <Text className="smallTitle">Delete confirmation</Text>
          <Text className="mt-2 smallTextGray">Are you sure you want to delete this {type}? This action cannot be undone.</Text>

          <View className="mt-5 flex-row gap-5 justify-center items-center">
            <NormalButton
              variant="cancel"
              text="Cancel"
              onClick={() => setHide(false)}
            />
            <NormalButton
              variant="danger"
              text="Delete"
              onClick={() => {
                onConfirm();
                setHide(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;