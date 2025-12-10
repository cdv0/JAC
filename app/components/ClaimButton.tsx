import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import NormalButton from './NormalButton';

interface ClaimModalProps {
  isClaimed: boolean;
  visible: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isClaimed,
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {isClaimed ? 'Business Already Claimed' : 'Claim This Business'}
              </Text>

              <Text style={styles.description}>
                {isClaimed
                  ? 'Mechanic is already claimed. If you believe something is wrong please contact us at JAC@gmail.com'
                  : 'Please contact us at JAC@gmail.com to claim this business with the necessary business information'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <NormalButton text = "Close" onClick={()=> {onClose();}}/>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxWidth: 448,
    width: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    width: '100%',
  },
  textContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

});