import React, { use, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserData } from '@/api/users';
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator } from 'react-native';
import { useUpdateUser } from '@/api/users';
import { useAuth } from "@/providers/AuthProvider";
import KeyboardAvoidingWrapper from "@/components/KeyboardAvoidingWrapper";

const roles = [
  { value: "foster", label: "Foster" },
  { value: "admin", label: "Admin" },
];

const EditUser: React.FC = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const {  data: user, isLoading, error } = useUserData(userId);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("foster");
  const [active, setActive] = useState(true);
  const [approved, setApproved] = useState<null | boolean>(null);
  
  const { user: admin } = useAuth();
  const { mutate: updateUser } = useUpdateUser();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFname(user.fname);
      setLname(user.lname);
      setEmail(user.email);
      setRole(user.role);
      setActive(user.active);
      setApproved(user.approved);
    }
  }, [user]);

  const isDirty =
    user &&
    (fname !== user.fname ||
      lname !== user.lname ||
      role !== user.role ||
      active !== user.active);

  const handleDiscard = () => {
    if (user) {
      setFname(user.fname);
      setLname(user.lname);
      setEmail(user.email);
      setRole(user.role);
      setActive(user.active);
      setApproved(user.approved);
    }
  };

  const handleSave = async () => {
    if (!user || !admin) return;
    const updateUserFields: any = {
      user_id: userId,
      fname,
      lname,
      role: role.toLowerCase(),
      active
    };
    if (user.approved === false && active === true) {
      updateUserFields.approved = true;
      updateUserFields.approved_by = admin.user_id;
    }
    
    updateUser(
      {...updateUserFields},
      {
        onSuccess: () => {
          router.back()
          Alert.alert('Success', 'User updated successfully!', [
            {
              text: 'OK'
            },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update user. Please try again.');
        }
      }
    ); 
  };

  const handleApprove = async () => {
    if (!user || !admin) return;
    setApproved(true);
    const updateUserFields: any = {
      user_id: userId,
      approved: true,
      approved_by: admin.user_id
    };
    updateUser(
      {...updateUserFields},
      {
        onSuccess: () => {
          router.back()
          Alert.alert('Success', 'User updated successfully!', [
            {
              text: 'OK'
            },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update user. Please try again.');
        }
      }
    ); 
  };

  const handleDecline = async () => {
    if (!user || !admin) return;
    setApproved(false);
    const updateUserFields: any = {
      user_id: userId,
      active: false,
      approved: false,
      approved_by: admin.user_id
    };
    updateUser(
      {...updateUserFields},
      {
        onSuccess: () => {
          router.back()
          Alert.alert('Success', 'User updated successfully!', [
            {
              text: 'OK'
            },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update user. Please try again.');
        }
      }
    ); 
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) {
    console.error("Error loading user:", error);
    return <View><Text>Error loading user </Text></View>;
  }

  return (
    <KeyboardAvoidingWrapper>
    <View style={styles.container}>
      <Text style={styles.header}>Edit User</Text>
      <View>
        <Text>First Name:</Text>
        <TextInput
          style={styles.input}
          value={fname}
          onChangeText={setFname}
        />
      </View>
      <View>
        <Text>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lname}
          onChangeText={setLname}
        />
      </View>
      <View>
        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
        />
      </View>
      <View>
        <Text>Role:</Text>
        <View style={{ borderColor: '#9e7ae7', borderWidth: 1, borderRadius: 12, marginBottom: 18, backgroundColor: '#fff', overflow: 'hidden' }}>
          <Picker
            selectedValue={role}
            onValueChange={setRole}
            style={{ height: 50, color: '#7c5fc9' }}
            dropdownIconColor="#7c5fc9"
          >
            {roles.map((r) => (
              <Picker.Item key={r.value} label={r.label} value={r.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View>
        <Text>Status:</Text>
        <View style={{ borderColor: '#9e7ae7', borderWidth: 1, borderRadius: 12, marginBottom: 18, backgroundColor: '#fff', overflow: 'hidden' }}>
          <Picker
            selectedValue={active ? "true" : "false"}
            onValueChange={(value) => setActive(value === "true")}
            style={{ height: 50, color: '#7c5fc9' }}
            dropdownIconColor="#7c5fc9"
          >
            <Picker.Item label="Active" value="true" />
            <Picker.Item label="Inactive" value="false" />
          </Picker>
        </View>
      </View>
      <View>
        {approved === true && (
          <View
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 4,
              alignItems: "center",
              marginBottom: 8,
              opacity: 0.6,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Approved</Text>
          </View>
        )}
        {approved === false && (
          <View
            style={{
              backgroundColor: "red",
              padding: 10,
              borderRadius: 4,
              alignItems: "center",
              marginBottom: 8,
              opacity: 0.6,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Declined</Text>
          </View>
        )}
        {approved === null && (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                title="Approve"
                color="green"
                onPress={handleApprove}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Decline"
                color="red"
                onPress={handleDecline}
              />
            </View>
          </>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Save"
          onPress={handleSave}
          disabled={!isDirty}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Discard"
          onPress={handleDiscard}
          disabled={!isDirty}
        />
      </View>
    </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdf6ff',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c5fc9',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#e5d9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterText: {
    color: '#7c5fc9',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 240,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c5fc9',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#e5d9fa',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#7c5fc9',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#7c5fc9',
    width: '100%',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#9e7ae7',
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default EditUser;
