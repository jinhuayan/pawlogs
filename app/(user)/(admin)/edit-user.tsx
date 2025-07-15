import React, { useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUsersList } from '@/api/users';
import { View, Text, TextInput, Button, } from "react-native";
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

  if (isLoading) return <ActivityIndicator />;
  if (error || !user) 
  {
    console.error("Error loading user:", error);
    return <View><Text>Error loading user </Text></View>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit User</Text>
      {/* You can use a ScrollView if the form gets long */}
      <View>
        <Text>First Name:</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
          value={form.fname}
          onChangeText={(text) => setForm((prev) => ({ ...prev, fname: text }))}
        />
      </View>
      <View>
        <Text>Last Name:</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
          value={form.lname}
          onChangeText={(text) => setForm((prev) => ({ ...prev, lname: text }))}
        />
      </View>
      <View>
        <Text>Email:</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 4, backgroundColor: "#eee" }}
          value={form.email}
          editable={false}
        />
      </View>
      <View>
        <Text>Role:</Text>
        {/* Picker for role */}
        <Picker
          selectedValue={form.role}
          onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
          style={{ marginBottom: 8 }}
        >
          {roles.map((r) => (
            <Picker.Item key={r.value} label={r.label} value={r.value} />
          ))}
        </Picker>
      </View>
      <View>
        <Text>Status:</Text>
        <Picker
          selectedValue={form.active ? "true" : "false"}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              active: value === "true",
            }))
          }
          style={{ marginBottom: 8 }}
        >
          <Picker.Item label="Active" value="true" />
          <Picker.Item label="Inactive" value="false" />
        </Picker>
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
          <Button
            title="Approve"
            color="#FFD700"
            onPress={handleApprove}
          />
        )}
      </View>
      <View style={{ marginTop: 16}}>
        <Button
          title="Save"
          onPress={handleSave}
          disabled={!isDirty}
        />
      </View>
      <View style={{ marginTop: 16 }}>
      <Button
        title="Discard"
        onPress={handleDiscard}
        disabled={!isDirty}
      />
    </View>
    </View>
  );

}

export default EditUser;