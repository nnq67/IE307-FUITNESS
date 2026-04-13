export const initialActivities = [
  {
    id: "1",
    name: "Full Body HIIT",
    kcal: 300,
    time: "45 Mins",
    dateString: "2025-12-20",
    isCompleted: true,
    type: "gym",
  },

  {
    id: "2",
    name: "Morning Jogging",
    kcal: 150,
    time: "30 Mins",
    dateString: "2025-12-26",
    isCompleted: true,
    type: "run",
  },
  {
    id: "3",
    name: "Upper Body",
    kcal: 120,
    time: "25 Mins",
    dateString: "2025-12-26",
    isCompleted: false,
    type: "gym",
  },

  {
    id: "4",
    name: "Marathon Practice",
    kcal: 500,
    time: "60 Mins",
    dateString: "2026-01-01",
    isCompleted: false,
    type: "run",
  },
];

// --- DỮ LIỆU BÀI ĐĂNG (BLOG POSTS) ---
export const mockData = [
  {
    id: "1",
    userName: "Olivia Rhye",
    date: "20 Jan 2022",
    userAvatar: "https://i.pravatar.cc/150?u=olivia",
    title: "Morning Practise",
    image:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
    commentUser: "Mike Johnson",
    commentAvatar: "https://i.pravatar.cc/150?u=mike",
    commentText: "That's great!",
    isFollowing: true,
    likes: 50,
    comments: 10,
    shares: 3,
  },
  {
    id: "2",
    userName: "Alex",
    date: "30 Sep 2025",
    userAvatar: "https://i.pravatar.cc/150?u=alex",
    title: "Morning Practise",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
    commentUser: "Olivia Rhye",
    commentAvatar: "https://i.pravatar.cc/150?u=olivia",
    commentText: "素晴らしいね。",
    isFollowing: true,
    likes: 10,
    comments: 2,
    shares: 1,
  },
  {
    id: "3",
    userName: "PongTon",
    date: "06 Oct 2025",
    userAvatar: "https://i.pravatar.cc/300?img=11",
    title: "Yah! Finally, I got it.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    commentUser: "Jisso",
    commentAvatar: "https://i.pravatar.cc/150?u=jisso",
    commentText: "So handsome!",
    isFollowing: false,
    likes: 150,
    comments: 20,
    shares: 5,
  },
];

export const exerciseLibrary = [
  {
    id: "ex1",
    name: "Plank",
    kcal: 1000,
    time: "15 Minutes",
    category: "Cardio",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzKiHW6m5_-twIE_PQzeor5gk9kb0GOI8V3w&s",
  },
  {
    id: "ex2",
    name: "Leg Press",
    kcal: 800,
    time: "20 Minutes",
    category: "Leg",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB7ueKUYA6lmayNkb1CMGpOotV1ttSYAQtuQ&s",
  },
  {
    id: "ex3",
    name: "Ab Roller",
    kcal: 500,
    time: "15 Minutes",
    category: "Abs /Core",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJqQj9lzZTQA5jNImT9o5DlQCagqxJyrVbg&s",
  },
  {
    id: "ex4",
    name: "Plate Push",
    kcal: 1210,
    time: "30 Minutes",
    category: "Shoulder",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbbraxxaoCh7FFxR49FBdLzqhTQy5932YuVA&s",
  },
];
