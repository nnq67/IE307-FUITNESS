import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import {
  useFonts,
  AlfaSlabOne_400Regular,
} from "@expo-google-fonts/alfa-slab-one";
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { ActivityContext } from "../../context/ActivityContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PRIMARY_BLUE = "#1A56DB";
const LIGHT_BLUE_BG = "#EAF4FF";
const COLOR_PROGRESS = "#FFCC80";
const COLOR_DONE = "#4CAF50";

const getCategoryIcon = (name) => {
  if (name.toLowerCase() === "all") return "apps";
  return "arm-flex"; 
};

export default function ProgressTracking({ trackedExercises }) {
  const navigation = useNavigation();
  const route = useRoute();

  const [fontsLoaded] = useFonts({
    AlfaSlabOne_400Regular,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const [calendarMode, setCalendarMode] = useState("Week");
  const [statFilter, setStatFilter] = useState("Day");
  const [viewingDate, setViewingDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { allActivities, setAllActivities } = useContext(ActivityContext);

  const [dbExercises, setDbExercises] = useState([]);
  const [loadingDB, setLoadingDB] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [actKcal, setActKcal] = useState("");
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(30);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([{ id: 'all', name: 'All', icon: 'apps' }]);

  const [pickerType, setPickerType] = useState(null);
  const [burnRate, setBurnRate] = useState(0); 

  const touchStartX = useRef(0);

  const formatDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isSameDay = (d1, d2) => formatDateString(d1) === formatDateString(d2);

  const checkTimeStatus = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    if (target < today) return "past";
    if (target > today) return "future";
    return "today";
  };

  const getWeekRangeText = (date) => {
    const start = new Date(date);
    const day = start.getDay(); 
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  useEffect(() => {
    async function setupDB() {
      try {
        const dbName = "fitness_data.db";
        const dbDir = `${FileSystem.documentDirectory}SQLite`;
        const dbPath = `${dbDir}/${dbName}`;

        const dirInfo = await FileSystem.getInfoAsync(dbDir);
        if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });

        const dbFileInfo = await FileSystem.getInfoAsync(dbPath);
        if (!dbFileInfo.exists || dbFileInfo.size === 0) {
          const asset = await Asset.fromModule(require("../../../assets/fitness_data.db")).downloadAsync();
          await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
        }

        const db = await SQLite.openDatabaseAsync(dbName);
        
        const allRows = await db.getAllAsync('SELECT * FROM exercises');
        const formatted = allRows.map(row => {
          let cat = "Other";
          try { cat = row.type ? JSON.parse(row.type)[0] : "Other"; } catch (e) { cat = row.type || "Other"; }
          return {
            id: row.id.toString(),
            name: row.title,
            category: cat.charAt(0).toUpperCase() + cat.slice(1),
            image: row.image_thumbnail,
            kcal: row.kcal || 150,
            time: row.time || "30 Mins",
          };
        });

        setDbExercises(formatted);

        const uniqueCats = [...new Set(formatted.map(ex => ex.category))].sort();
        const dynamicCats = uniqueCats.map((cat, index) => ({
          id: index.toString(),
          name: cat, 
          icon: getCategoryIcon(cat)
        }));
        setCategories([{ id: 'all', name: 'All', icon: 'apps' }, ...dynamicCats]);

      } catch (error) {
        console.error("DB Error:", error);
      } finally {
        setLoadingDB(false);
      }
    }
    setupDB();
  }, []);

  useEffect(() => {
    if (trackedExercises && trackedExercises.length > 0) {
      setAllActivities((prevAll) => {
        const newItems = trackedExercises.filter(ex => {
          return !prevAll.some(act => act.originId === ex.id && act.dateString === formatDateString(new Date()));
        });

        if (newItems.length === 0) return prevAll;

        const todayStr = formatDateString(new Date());
        const formatted = newItems.map((ex, index) => ({
          id: `gym-${Date.now()}-${index}`,
          originId: ex.id,
          name: ex.name,
          kcal: parseInt(ex.kcal) || 0,
          time: ex.time || "30 Mins",
          dateString: todayStr,
          isCompleted: false,
          type: "gym",
        }));
        return [...formatted, ...prevAll];
      });
      setSelectedDate(new Date());
    }
  }, [trackedExercises]);

  useEffect(() => {
    if (route.params?.newJoggingActivity) {
      const { newJoggingActivity } = route.params;
      setAllActivities((prev) => [newJoggingActivity, ...prev]);
      navigation.setParams({ newJoggingActivity: undefined });
    }
  }, [route.params?.newJoggingActivity]);

  const handleSelectExercise = (item) => {
    setSelectedExercise(item);
    
    const defaultTime = parseInt(item.time) || 30;
    const defaultKcal = parseInt(item.kcal) || 150;
    const rate = defaultTime > 0 ? defaultKcal / defaultTime : 5;
    
    setBurnRate(rate);
    setSelectedHour(0);
    setSelectedMinute(30);
    
    const newKcal = Math.round(30 * rate);
    setActKcal(newKcal.toString());
  };

  const handleKcalChange = (text) => {
    setActKcal(text);
    const val = parseInt(text);
    if (!isNaN(val) && burnRate > 0) {
      const mins = Math.round(val / burnRate);
      if (mins > 0) {
        setSelectedHour(Math.floor(mins / 60));
        setSelectedMinute(mins % 60);
      }
    }
  };

  const handleTimeSelect = (val) => {
    let h = selectedHour;
    let m = selectedMinute;
    if (pickerType === "hour") h = val; else m = val;
    
    setSelectedHour(h);
    setSelectedMinute(m);
    setPickerType(null);

    const totalMins = h * 60 + m;
    if (totalMins > 0 && burnRate > 0) {
      const newKcal = Math.round(totalMins * burnRate);
      setActKcal(newKcal.toString());
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setSelectedExercise(null);
    setActKcal("");
    setSelectedHour(0);
    setSelectedMinute(30);
    setSearchQuery("");
    setSelectedCategory("All");
    setBurnRate(5); 
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setSelectedExercise({ name: item.name }); 
    
    const k = item.kcal || 0;
    setActKcal(String(k));
    
    const m = parseInt(item.time) || 30;
    setSelectedHour(Math.floor(m / 60));
    setSelectedMinute(m % 60);

    const rate = m > 0 && k > 0 ? k / m : 5;
    setBurnRate(rate);

    setModalVisible(true);
  };

  const handleSaveActivity = () => {
    if (!selectedExercise) {
      Alert.alert("Required", "Please select an exercise.");
      return;
    }
    const totalMinutes = selectedHour * 60 + selectedMinute;
    if (totalMinutes === 0) {
        Alert.alert("Invalid Time", "Duration must be greater than 0");
        return;
    }

    const timeString = `${totalMinutes} Mins`;
    const calories = actKcal ? parseInt(actKcal) : null;

    if (editingId) {
      setAllActivities((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: selectedExercise.name, time: timeString, kcal: calories }
            : item
        )
      );
    } else {
      const newItem = {
        id: Math.random().toString(),
        name: selectedExercise.name,
        kcal: calories,
        time: timeString,
        dateString: formatDateString(selectedDate),
        isCompleted: false,
        type: "gym",
      };
      setAllActivities([newItem, ...allActivities]);
    }
    setModalVisible(false);
  };

  const filteredExercises = useMemo(() => {
    return dbExercises.filter(ex => {
      const matchCat = selectedCategory === "All" || ex.category === selectedCategory;
      const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [dbExercises, selectedCategory, searchQuery]);

  const navigateCalendar = (direction) => {
    const newDate = new Date(viewingDate);
    if (calendarMode === "Month") newDate.setMonth(viewingDate.getMonth() + direction);
    else newDate.setDate(viewingDate.getDate() + direction * 7);
    setViewingDate(newDate);
  };

  const calendarDays = useMemo(() => {
    const days = [];
    if (calendarMode === "Month") {
      const year = viewingDate.getFullYear();
      const month = viewingDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const padding = (firstDay + 6) % 7; 
      for (let i = 0; i < padding; i++) days.push(null);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    } else {
      const day = viewingDate.getDay();
      const diff = viewingDate.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(viewingDate);
      monday.setDate(diff);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
      }
    }
    return days;
  }, [viewingDate, calendarMode]);

  const calculatedStats = useMemo(() => {
    let filteredList = [];
    const selDateStr = formatDateString(selectedDate);

    if (statFilter === "Day") {
      filteredList = allActivities.filter((item) => item.dateString === selDateStr);
    } else if (statFilter === "Week") {
      const d = selectedDate.getDay();
      const diff = selectedDate.getDate() - d + (d === 0 ? -6 : 1);
      const mon = new Date(selectedDate); mon.setDate(diff); mon.setHours(0,0,0,0);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999);
      filteredList = allActivities.filter(i => {
        const dt = new Date(i.dateString);
        return dt >= mon && dt <= sun;
      });
    } else {
      filteredList = allActivities.filter(i => i.dateString.startsWith(selDateStr.substring(0, 7)));
    }

    const totalKcal = filteredList.reduce((acc, cur) => (cur.isCompleted ? acc + (cur.kcal || 0) : acc), 0);
    const totalMins = filteredList.reduce((acc, cur) => (cur.isCompleted ? acc + (parseInt(cur.time) || 0) : acc), 0);
    const completedCount = filteredList.filter(i => i.isCompleted).length;

    return {
      cal: totalKcal.toLocaleString("vi-VN"),
      time: totalMins > 60 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` : `${totalMins}m`,
      count: `${completedCount}/${filteredList.length}`,
    };
  }, [statFilter, selectedDate, allActivities]);

  if (!fontsLoaded) return null;
  const listActivities = allActivities.filter((item) => item.dateString === formatDateString(selectedDate));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress Tracking</Text>
        </View>

        <View style={styles.calendarContainer} onTouchStart={(e)=>touchStartX.current=e.nativeEvent.pageX} onTouchEnd={(e)=>{
            const diff = touchStartX.current - e.nativeEvent.pageX;
            if(Math.abs(diff) > 50) navigateCalendar(diff > 0 ? 1 : -1);
        }}>
          <View style={styles.calendarHeader}>
            <View style={styles.navRow}>
              <TouchableOpacity onPress={() => navigateCalendar(-1)}><Feather name="chevron-left" size={24} color={PRIMARY_BLUE} /></TouchableOpacity>
              <Text style={styles.monthTitle}>
                {calendarMode === "Month" 
                  ? viewingDate.toLocaleString("en-US", { month: "long", year: "numeric" }) 
                  : getWeekRangeText(viewingDate)}
              </Text>
              <TouchableOpacity onPress={() => navigateCalendar(1)}><Feather name="chevron-right" size={24} color={PRIMARY_BLUE} /></TouchableOpacity>
            </View>
            <View style={styles.controlsRow}>
              {!isSameDay(selectedDate, new Date()) && (
                <TouchableOpacity onPress={() => { setSelectedDate(new Date()); setViewingDate(new Date()); }} style={styles.todayBtn}>
                  <Text style={styles.todayText}>Today</Text>
                </TouchableOpacity>
              )}
              <View style={styles.toggleContainer}>
                <TouchableOpacity style={[styles.toggleBtn, calendarMode === "Week" && styles.toggleBtnActive]} onPress={() => setCalendarMode("Week")}>
                  <Text style={[styles.toggleText, calendarMode === "Week" && styles.toggleTextActive]}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, calendarMode === "Month" && styles.toggleBtnActive]} onPress={() => setCalendarMode("Month")}>
                  <Text style={[styles.toggleText, calendarMode === "Month" && styles.toggleTextActive]}>Month</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.calendarContent}>
            <View style={styles.weekDayRow}>
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                <View key={d} style={styles.weekDayBadge}><Text style={styles.weekDayText}>{d}</Text></View>
              ))}
            </View>
            <View style={[styles.daysContainer, calendarMode === "Month" && styles.daysContainerMonth]}>
              {calendarDays.map((date, index) => {
                if (!date) return <View key={`empty-${index}`} style={[styles.dayCell, styles.dayCellMonth, {backgroundColor: 'transparent'}]} />;
                const isSelected = isSameDay(date, selectedDate);
                const hasAct = allActivities.some(a => a.dateString === formatDateString(date));
                const allDone = hasAct && allActivities.filter(a => a.dateString === formatDateString(date)).every(a => a.isCompleted);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      calendarMode === "Week" ? styles.dayCellWeek : styles.dayCellMonth,
                      isSelected && { backgroundColor: PRIMARY_BLUE },
                      !isSelected && hasAct && { backgroundColor: allDone ? COLOR_DONE : COLOR_PROGRESS },
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected, !isSelected && allDone && { color: "#fff" }]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.filterRow}>
            {["Day", "Week", "Month"].map((item) => (
              <TouchableOpacity key={item} onPress={() => setStatFilter(item)}>
                <Text style={[styles.filterText, statFilter === item && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: "#FFE5D9" }]}><FontAwesome5 name="fire" size={16} color="#FF5722" /></View>
              <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>{calculatedStats.cal}</Text>
              <Text style={styles.statLabel}>Kcal Burnt</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: "#FFF4E5" }]}><Ionicons name="time" size={18} color="#FF9800" /></View>
              <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>{calculatedStats.time}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}><FontAwesome5 name="dumbbell" size={16} color="#4CAF50" /></View>
              <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>{calculatedStats.count}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.joggingButton} onPress={() => navigation.navigate("Jogging")}>
          <LinearGradient colors={[PRIMARY_BLUE, "#4C8BF5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.joggingGradient}>
            <View style={styles.joggingContent}>
              <View><Text style={styles.joggingTitle}>Go Jogging</Text><Text style={styles.joggingSub}>Track your run map</Text></View>
              <FontAwesome5 name="arrow-right" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionContainer}>
          <View style={styles.activityHeaderRow}>
            <Text style={styles.sectionTitle}>Activities <Text style={styles.subDate}>({formatDateString(selectedDate)})</Text></Text>
            {checkTimeStatus(selectedDate) !== "past" && (
              <TouchableOpacity onPress={openAddModal} style={styles.addButtonSmall}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
            )}
          </View>
          {listActivities.length > 0 ? (
            listActivities.map((item) => (
              <View key={item.id} style={styles.activityCard}>
                <TouchableOpacity onPress={() => {
                    const act = allActivities.find(a => a.id === item.id);
                    if (!act) return;
                    const status = checkTimeStatus(new Date(act.dateString));
                    if (status === "past") { Alert.alert("Locked","Cannot change past records."); return; }
                    if (status === "future") { Alert.alert("Plan Ahead", "Cannot complete future activities yet."); return; }
                    setAllActivities(prev => prev.map(i => i.id === item.id ? { ...i, isCompleted: !i.isCompleted } : i));
                }} style={[styles.checkbox, item.isCompleted && styles.checkboxChecked]}>
                  {item.isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
                </TouchableOpacity>
                <View style={[styles.activityIcon, { backgroundColor: item.type === "run" ? "#FFE5D9" : "#E3F2FD" }]}>
                  <FontAwesome5 name={item.type === "run" ? "running" : "dumbbell"} size={20} color={item.type === "run" ? "#FF5722" : "#1A56DB"} />
                </View>
                <View style={styles.activityInfo}>
                  {item.kcal ? <Text style={styles.activityKcal}>🔥 {item.kcal} Kcal</Text> : null}
                  <Text style={[styles.activityName, item.isCompleted && styles.textStrikeThrough]} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.activityDate}>{item.time}</Text>
                </View>
                {checkTimeStatus(selectedDate) !== "past" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}><Feather name="edit-2" size={16} color="#888" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert("Delete", "Are you sure?", [{ text: "Cancel" }, { text: "Delete", style: "destructive", onPress: () => setAllActivities(prev => prev.filter(i => i.id !== item.id)) }]);
                    }} style={styles.actionBtn}><Feather name="trash-2" size={16} color="#FF4444" /></TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : <Text style={styles.emptyText}>No activities scheduled.</Text>}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editingId ? "Edit Activity" : "Select Exercise"}</Text>

            {editingId ? (
              <View style={styles.selectedExerciseDisplay}>
                <Text style={styles.selectedExerciseText}>{selectedExercise?.name}</Text>
              </View>
            ) : (
              <>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#9CA3AF" style={{marginRight: 8}} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search exercise..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <View style={{ height: 90 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
                    {categories.map((cat) => (
                      <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.name)} style={{ alignItems: "center", marginRight: 15 }}>
                        <View style={[styles.catIconBox, selectedCategory === cat.name && styles.activeCatIcon]}>
                          <MaterialCommunityIcons name={cat.icon} size={24} color={selectedCategory === cat.name ? "#FFF" : "#4B5563"} />
                        </View>
                        <Text style={[styles.catText, selectedCategory === cat.name && { color: PRIMARY_BLUE }]}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.exerciseListContainer}>
                  {loadingDB ? <ActivityIndicator color={PRIMARY_BLUE} /> : (
                    <FlatList
                      data={filteredExercises}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={[styles.exerciseItem, selectedExercise?.id === item.id && styles.exerciseItemSelected]} 
                          onPress={() => handleSelectExercise(item)}
                        >
                          <Image source={{ uri: item.image }} style={styles.exListImage} />
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.exListName, selectedExercise?.id === item.id && {color: PRIMARY_BLUE}]}>{item.name}</Text>
                            <Text style={styles.exListSub}>{item.category} • {item.kcal} kcal</Text>
                          </View>
                          {selectedExercise?.id === item.id && <Ionicons name="checkmark-circle" size={24} color={PRIMARY_BLUE} />}
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.emptyText}>No exercises found.</Text>}
                    />
                  )}
                </View>
              </>
            )}

            {(selectedExercise || editingId) && (
              <View style={styles.inputsContainer}>
                <View style={styles.divider} />
                
                <Text style={styles.inputLabel}>Duration</Text>
                <View style={styles.timePickerRow}>
                  <TouchableOpacity style={styles.timeSelectBtn} onPress={() => setPickerType("hour")}>
                    <Text style={styles.timeSelectText}>{selectedHour} Hours</Text>
                    <Ionicons name="caret-down" size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.timeSelectBtn} onPress={() => setPickerType("minute")}>
                    <Text style={styles.timeSelectText}>{selectedMinute} Mins</Text>
                    <Ionicons name="caret-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Calories (Auto-sync)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 150" 
                  value={actKcal} 
                  onChangeText={handleKcalChange} 
                  keyboardType="numeric" 
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave, (!selectedExercise && !editingId) && {opacity: 0.5}]} disabled={!selectedExercise && !editingId} onPress={handleSaveActivity}>
                <Text style={styles.btnTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {pickerType && (
          <Modal transparent={true} visible={true} animationType="fade">
            <TouchableOpacity style={styles.pickerOverlay} onPress={() => setPickerType(null)}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Select {pickerType === "hour" ? "Hours" : "Minutes"}</Text>
                <FlatList
                  data={pickerType === "hour" ? Array.from({ length: 13 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i * 5)}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.pickerItem} onPress={() => handleTimeSelect(item)}>
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 200 }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  headerTitle: { fontFamily: "AlfaSlabOne_400Regular", fontSize: 28, color: PRIMARY_BLUE },

  calendarContainer: { backgroundColor: LIGHT_BLUE_BG, marginHorizontal: 20, borderRadius: 24, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, marginBottom: 20 },
  calendarHeader: { marginBottom: 15 },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  monthTitle: { fontFamily: "Montserrat_700Bold", fontSize: 14, color: PRIMARY_BLUE, textAlign: "center", flex: 1 },
  
  controlsRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", position: 'relative', height: 32 },
  todayBtn: { position: 'absolute', left: 0, backgroundColor: "#fff", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1 },
  todayText: { fontFamily: "Montserrat_600SemiBold", fontSize: 10, color: PRIMARY_BLUE },
  toggleContainer: { flexDirection: "row" },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, marginLeft: 8, backgroundColor: "#fff" },
  toggleBtnActive: { backgroundColor: PRIMARY_BLUE },
  toggleText: { fontFamily: "Montserrat_600SemiBold", fontSize: 12, color: PRIMARY_BLUE },
  toggleTextActive: { color: "#fff" },

  weekDayRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  weekDayBadge: { backgroundColor: "#fff", borderRadius: 12, width: 38, height: 25, justifyContent: "center", alignItems: "center" },
  weekDayText: { fontFamily: "Montserrat_700Bold", fontSize: 10, color: "#333" },
  daysContainer: { flexDirection: "row", justifyContent: "space-between" },
  daysContainerMonth: { flexWrap: "wrap", justifyContent: "flex-start" },
  dayCell: { backgroundColor: "#fff", borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 8, elevation: 1 },
  dayCellWeek: { width: (SCREEN_WIDTH - 40 - 32) / 7 - 4, height: 45 },
  dayCellMonth: { width: "13%", aspectRatio: 1, marginRight: "1.2%" },
  dayText: { fontFamily: "Montserrat_600SemiBold", fontSize: 14, color: PRIMARY_BLUE },
  dayTextSelected: { fontFamily: "Montserrat_700Bold", color: "#fff" },

  sectionContainer: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: "AlfaSlabOne_400Regular", fontSize: 20, color: "#000", marginBottom: 10 },
  subDate: { fontSize: 14, fontFamily: "Montserrat_400Regular", color: "#888" },
  filterRow: { flexDirection: "row", marginBottom: 15 },
  filterText: { fontFamily: "Montserrat_600SemiBold", fontSize: 14, color: "#ccc", marginRight: 20 },
  filterTextActive: { color: "#000" },
  
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: { width: "30%", backgroundColor: "#fff", borderRadius: 16, padding: 8, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 3 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statValue: { fontFamily: "Montserrat_700Bold", fontSize: 15, color: "#333", marginBottom: 2, textAlign: "center", width: '100%' },
  statLabel: { fontFamily: "Montserrat_400Regular", fontSize: 10, color: "#888" },

  joggingButton: { marginHorizontal: 20, marginBottom: 25, borderRadius: 16, elevation: 5, shadowColor: PRIMARY_BLUE, shadowOpacity: 0.3 },
  joggingGradient: { padding: 20, borderRadius: 16 },
  joggingContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  joggingTitle: { fontFamily: "AlfaSlabOne_400Regular", fontSize: 18, color: "#fff" },
  joggingSub: { fontFamily: "Montserrat_400Regular", fontSize: 12, color: "#E0EFFF" },

  activityHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  addButtonSmall: { backgroundColor: PRIMARY_BLUE, width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  activityCard: { flexDirection: "row", backgroundColor: "#F7F8FA", borderRadius: 20, padding: 15, marginBottom: 15, alignItems: "center" },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: "#ddd", marginRight: 15, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  checkboxChecked: { backgroundColor: COLOR_DONE, borderColor: COLOR_DONE },
  activityIcon: { width: 46, height: 46, borderRadius: 23, justifyContent: "center", alignItems: "center", marginRight: 12 },
  activityInfo: { flex: 1, marginRight: 10 },
  activityTop: { flexDirection: "row", marginBottom: 2 },
  activityKcal: { fontFamily: "Montserrat_600SemiBold", fontSize: 10, color: "#FF5722" },
  activityName: { fontFamily: "Montserrat_700Bold", fontSize: 14, color: "#333", marginBottom: 2 },
  textStrikeThrough: { textDecorationLine: "line-through", color: "#aaa" },
  activityDate: { fontFamily: "Montserrat_400Regular", fontSize: 12, color: PRIMARY_BLUE },
  actionButtons: { flexDirection: "row" },
  actionBtn: { marginLeft: 12, padding: 4 },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20, fontFamily: "Montserrat_400Regular" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalView: { width: "90%", height: "85%", backgroundColor: "white", borderRadius: 24, padding: 20, elevation: 5 },
  modalTitle: { fontFamily: "Montserrat_700Bold", fontSize: 18, marginBottom: 15, textAlign: "center", color: PRIMARY_BLUE },
  
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 12, height: 45, marginBottom: 10 },
  searchInput: { flex: 1, fontFamily: "Montserrat_400Regular", fontSize: 14, color: "#333" },
  catIconBox: { width: 45, height: 45, backgroundColor: "#F3F4F6", borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 5 },
  activeCatIcon: { backgroundColor: PRIMARY_BLUE },
  catText: { fontFamily: "Montserrat_600SemiBold", fontSize: 10, color: "#4B5563" },

  exerciseListContainer: { flex: 1, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 10, marginBottom: 10 },
  exerciseItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 12, padding: 10, marginBottom: 8, elevation: 1 },
  exerciseItemSelected: { borderWidth: 1.5, borderColor: PRIMARY_BLUE, backgroundColor: "#F0F6FF" },
  exListImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  exListName: { fontFamily: "Montserrat_600SemiBold", fontSize: 14, color: "#333" },
  exListSub: { fontFamily: "Montserrat_400Regular", fontSize: 11, color: "#888", marginTop: 2 },

  selectedExerciseDisplay: { backgroundColor: "#F0F6FF", padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: PRIMARY_BLUE },
  selectedExerciseText: { fontFamily: "Montserrat_700Bold", fontSize: 16, color: PRIMARY_BLUE },

  inputsContainer: { marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  inputLabel: { fontFamily: "Montserrat_600SemiBold", fontSize: 12, color: "#666", marginBottom: 5, marginLeft: 4 },
  input: { height: 48, width: "100%", backgroundColor: "#F5F5F5", borderRadius: 12, marginBottom: 10, paddingHorizontal: 15, fontFamily: "Montserrat_400Regular" },
  
  timePickerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  timeSelectBtn: { flex: 1, backgroundColor: "#F5F5F5", height: 48, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, marginHorizontal: 5 },
  timeSelectText: { fontFamily: "Montserrat_600SemiBold", color: "#333" },
  
  pickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "center", alignItems: "center" },
  pickerContainer: { width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20, maxHeight: 300 },
  pickerTitle: { fontFamily: "Montserrat_700Bold", fontSize: 16, marginBottom: 10, textAlign: "center", color: PRIMARY_BLUE },
  pickerItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  pickerItemText: { textAlign: "center", fontFamily: "Montserrat_400Regular", fontSize: 16 },

  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 5 },
  btn: { borderRadius: 12, paddingVertical: 12, width: "47%", alignItems: "center" },
  btnCancel: { backgroundColor: "#eee" },
  btnSave: { backgroundColor: PRIMARY_BLUE },
  btnTextCancel: { fontFamily: "Montserrat_600SemiBold", color: "#555" },
  btnTextSave: { fontFamily: "Montserrat_600SemiBold", color: "white" },
});