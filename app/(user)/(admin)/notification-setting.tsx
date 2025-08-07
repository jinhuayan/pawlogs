import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '@/providers/AuthProvider'
import { useFetchNotification, useUpdateNotification } from '@/api/settings'
import { Picker } from '@react-native-picker/picker'
import { FontAwesome } from '@expo/vector-icons'

type NotificationItem = {
  id: number
  role: 'admin' | 'foster'
  active: boolean
  interval_unit: string
  interval_value: string // allow empty
  original_active: boolean
  original_unit: string
  original_value: string
}

const intervalUnits = [
  { label: 'Second(s)', value: 'seconds' },
  { label: 'Minute(s)', value: 'minutes' },
  { label: 'Hour(s)', value: 'hours' },
  { label: 'Day(s)', value: 'days' },
  { label: 'Week(s)', value: 'weeks' },
]

const NotificationRow: React.FC<{
  item: NotificationItem
  onToggle: (item: NotificationItem) => void
  onChangeUnit: (item: NotificationItem, unit: string) => void
  onChangeValue: (item: NotificationItem, value: string) => void
  onSave: (item: NotificationItem) => void
}> = ({ item, onToggle, onChangeUnit, onChangeValue, onSave }) => {
  const dirty =
    item.interval_unit !== item.original_unit ||
    item.interval_value !== item.original_value

  return (
    <View style={styles.row}>
      <Switch
        value={item.active}
        onValueChange={() => onToggle(item)}
        style={styles.switch}
      />
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={item.interval_unit}
          onValueChange={(u) => onChangeUnit(item, u)}
          enabled={item.active}
          style={styles.picker}
        >
          {intervalUnits.map((u) => (
            <Picker.Item key={u.value} label={u.label} value={u.value} />
          ))}
        </Picker>
      </View>
      <TextInput
        value={item.interval_value}
        onChangeText={(v) => onChangeValue(item, v)}
        placeholder={item.original_value === '' ? 'Add value' : ''}
        keyboardType="numeric"        
        editable={item.active}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => onSave(item)}
        disabled={!dirty}
        style={[styles.saveButton, !dirty && styles.saveButtonDisabled]}
      >
        <FontAwesome name="save" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const NotificationSetting: React.FC = () => {
  const { user } = useAuth()
  const { data: notifications, isLoading, error } = useFetchNotification()
  const { mutate: updateNotification } = useUpdateNotification()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (notifications) {
      const mapped = notifications
        .map((n) => ({
          id: n.id,
          role: n.role,
          active: n.active,
          interval_unit: n.interval_unit,
          interval_value: n.interval_value != null ? String(n.interval_value) : '',
          original_active: n.active,
          original_unit: n.interval_unit,
          original_value: n.interval_value != null ? String(n.interval_value) : '',
        }))
        .sort((a, b) => (a.role === 'admin' ? -1 : 1))
      setItems(mapped)
    }
  }, [notifications])

  const handleToggle = useCallback(
    (item: NotificationItem) => {
      const updated = { ...item, active: !item.active }
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)))
      setIsUpdating(true)
      updateNotification(
        { id: item.id, role: item.role, active: updated.active, changed_by: user.id },
        {
          onSuccess: () => {
            setIsUpdating(false)
            Alert.alert('Setting Updated!')
          },
          onError: (err) => {
            setIsUpdating(false)
            Alert.alert('Error', err.message || 'Failed to update setting')
          },
        }
      )
    },
    [updateNotification, user.id]
  )

  const handleChangeUnit = useCallback(
    (item: NotificationItem, unit: string) => {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, interval_unit: unit } : i))
      )
    },
    []
  )

  const handleChangeValue = useCallback(
    (item: NotificationItem, value: string) => {
      const filtered = value.replace(/[^0-9]/g, '')
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, interval_value: filtered } : i)))
    },
    []
  )

  const handleSave = useCallback(
    (item: NotificationItem) => {
      Keyboard.dismiss()
      setIsUpdating(true)
      if (item.interval_unit && (!item.interval_value || Number(item.interval_value) <= 0)) {
        setIsUpdating(false)
        Alert.alert('Invalid', 'Please enter a valid number before saving.')
        return
      }
      updateNotification(
        {
          id: item.id,
          role: item.role,
          active: item.active,
          interval_unit: item.interval_unit,
          interval_value: Number(item.interval_value),
          changed_by: user.id,
        },
        {
          onSuccess: () => {
            setIsUpdating(false)
            Alert.alert('Setting Updated!')
          },
          onError: (err) => {
            setIsUpdating(false)
            Alert.alert('Error', err.message || 'Failed to update setting')
          },
        }
      )
    },
    [updateNotification, user.id]
  )

  if (isLoading) return <ActivityIndicator />
  if (error)
    return (
      <View style={styles.center}>
        <Text>Error loading notifications</Text>
      </View>
    )

  const adminItem = items.find((i) => i.role === 'admin')
  const fosterItem = items.find((i) => i.role === 'foster')

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>

      {adminItem && (
        <>
          <Text style={styles.label}>Push Notification for Admin</Text>
          <NotificationRow
            item={adminItem}
            onToggle={handleToggle}
            onChangeUnit={handleChangeUnit}
            onChangeValue={handleChangeValue}
            onSave={handleSave}
          />
        </>
      )}

      {fosterItem && (
        <>
          <Text style={styles.label}>Push Notification for User</Text>
          <NotificationRow
            item={fosterItem}
            onToggle={handleToggle}
            onChangeUnit={handleChangeUnit}
            onChangeValue={handleChangeValue}
            onSave={handleSave}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: '600', marginVertical: 8, color: '#333' },
  container: { flex: 1, backgroundColor: '#fdf6ff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#7c5fc9' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  switch: { marginRight: 8 },
  pickerWrapper: {
    width:  '40%',
    height: 53,
    borderColor: '#9e7ae7',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginRight: 8
  },
  picker: { flex: 1 },
  input: { width: '26%', height: 53, borderWidth: 1, borderColor: '#9e7ae7', borderRadius: 12, textAlign: 'center', marginRight: 8, backgroundColor: '#fff',overflow: 'hidden' },
  saveButton: { padding: 10, backgroundColor: '#7c5fc9', borderRadius: 4 },
  saveButtonDisabled: { backgroundColor: '#ccc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  updating: { marginTop: 10 },
})

export default NotificationSetting
