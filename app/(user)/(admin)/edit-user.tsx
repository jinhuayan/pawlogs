import React, { useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUsersList } from '@/api/users';
import { View, Text,StyleSheet, TextInput, Button, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator } from 'react-native';

const roles = [
  { value: "foster", label: "Foster" },
  { value: "admin", label: "Admin" },
];

const EditUser: React.FC = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  console.log("Editing user with IDs:", userId);

  const { data: usersQuery, isLoading, error } = useUsersList();

  const user = useMemo(
    () => usersQuery?.find((u: any) => u.user_id === userId),
    [usersQuery, userId]
  );
  console.log("User datas:", user);

  const [form, setForm] = useState(() =>
    user
      ? {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        active: user.active,
      }
      : {
        fname: "",
        lname: "",
        email: "",
        role: "foster",
        active: true,
      }
  );

  // Track if form is dirty
  const isDirty =
    user &&
    (form.fname !== user.fname ||
      form.lname !== user.lname ||
      form.role !== user.role ||
      form.active !== user.active);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  // Discard changes
  const handleDiscard = () => {
    if (user) {
      setForm({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        active: user.active,
      });
    }
  };

  // Save changes (stub)
  const handleSave = () => {
    // Implement save logic here
    // e.g., call API to update user
  };

  // Approve user (stub)
  const handleApprove = () => {
    // Implement approve logic here
  };
    // Approve user (stub)
  const handleDecline = () => {
    // Implement approve logic here
  };

  if (isLoading) return <ActivityIndicator />;
  if (error || !user) 
  {
    console.error("Error loading user:", error);
    return <View><Text>Error loading user </Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit User</Text>
      {/* You can use a ScrollView if the form gets long */}
      <View>
        <Text>First Name:</Text>
        <TextInput
          style={styles.input}
          value={form.fname}
          onChangeText={(text) => setForm((prev) => ({ ...prev, fname: text }))}
        />
      </View>
      <View>
        <Text>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={form.lname}
          onChangeText={(text) => setForm((prev) => ({ ...prev, lname: text }))}
        />
      </View>
      <View>
        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          editable={false}
        />
      </View>
      <View>
        <Text>Role:</Text>
        <View style={{ borderColor: '#9e7ae7', borderWidth: 1, borderRadius: 12, marginBottom: 18, backgroundColor: '#fff', overflow: 'hidden' }}>
          <Picker
            selectedValue={form.role}
            onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
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
            selectedValue={form.active ? "true" : "false"}
            onValueChange={(value) =>
              setForm((prev) => ({
          ...prev,
          active: value === "true",
              }))
            }
            style={{ height: 50, color: '#7c5fc9' }}
            dropdownIconColor="#7c5fc9"
          >
            <Picker.Item label="Active" value="true" />
            <Picker.Item label="Inactive" value="false" />
          </Picker>
        </View>
      </View>
      <View>
        {/* Custom colored disabled buttons using View/Text for color */}
        {user.approved === true && (
          <View
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 4,
              alignItems: "center",
              marginBottom: 8,
              opacity: 0.6, // visually indicate disabled
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Approved</Text>
          </View>
        )}
        {user.approved === false && (
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
        {user.approved === null && (
          <View style={styles.buttonWrapper}>
          <Button
            title="Approve"
            color="green"
            onPress={handleApprove}
          />
          </View>
        )}
        {user.approved === null && (
          <View style={styles.buttonWrapper}>
          <Button
            title="Decline"
            color="red"
            onPress={handleDecline}
          />
          </View>
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
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fdf6ff',
    flexGrow: 1,
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