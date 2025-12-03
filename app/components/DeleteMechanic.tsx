import {View, Text, Modal} from "react-native";
import NormalButton from "./NormalButton";
import {getCurrentUser} from "aws-amplify/auth";

type DeleteMechanicProps = {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    setVisible: (visible: boolean) => void;
    mechanicId: string
}

export const DeleteMechanic = ({isVisible, onConfirm, setVisible}:DeleteMechanicProps) => {

    async function handleConfirmDelete(){
        try{
            const {userId} = await getCurrentUser();
            // Call backend API to delete mechanic shop
            const response = await fetch(`process.env.EXPO_PUBLIC_MECHANICS_DELETE?${mechanicId}=mechanicId`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                }});
                }
        catch (error){
            console.error("Error deleting mechanic shop:", error);
        }
    }



  return (
    <Modal
    transparent = {true}
    visible = {isVisible}>

    <View className= "flex-1 justify-center items-center bg-black/40">
        <View className = "w-8/12 bg-white rounded-xl p-5">
        <Text className = "smallTitle">Delete confirmation</Text>
        <Text className = "mt02 smallTextGray">Are you sure you want to delete your shop?</Text>
        <View className = "mt-5 flex-row gap-5 justify-center items-center">
            <NormalButton
                text= "Cancel"
                variant = "cancel"
                onClick={() => {setVisible(false)}}/>
            <NormalButton
                text= "Delete"
                variant = "danger"
                onClick={() => {
                    handleConfirmDelete();
                    onConfirm();
                    setVisible(false);
                }}
            />
        </View>
        </View>
    </View>    
    </Modal>
    )}
