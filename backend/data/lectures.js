const lectures = [
  {
    subjectName: "Toán học lớp 10",
    subtitle: "Khóa học toàn diện về Đại số và Hình học lớp 10",
    teacher: "Thầy Nguyễn Văn A",
    description: "Khóa học cung cấp kiến thức toàn diện về chương trình Toán lớp 10, bao gồm Đại số và Hình học. Học sinh sẽ được học các khái niệm cơ bản đến nâng cao, kèm theo nhiều bài tập thực hành.",
    price: 499000,
    rating: 4.8,
    reviews: 156,
    students: 1200,
    lastUpdated: new Date("2024-03-15"),
    language: "Vietnamese",
    image: "https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg",
    whatYouWillLearn: [
      "Nắm vững kiến thức Đại số và Hình học lớp 10",
      "Thành thạo các phương pháp giải toán",
      "Làm quen với các dạng bài tập từ cơ bản đến nâng cao",
      "Phát triển tư duy logic và khả năng giải quyết vấn đề"
    ],
    requirements: [
      "Kiến thức Toán lớp 9",
      "Máy tính cơ bản",
      "Tinh thần học tập nghiêm túc"
    ],
    curriculum: [
      {
        section: "Chương 1: Mệnh đề và Tập hợp",
        lectures: [
          { title: "Bài 1: Mệnh đề", preview: true },
          { title: "Bài 2: Tập hợp", preview: false },
          { title: "Bài 3: Các phép toán tập hợp", preview: false }
        ]
      },
      {
        section: "Chương 2: Hàm số bậc nhất và bậc hai",
        lectures: [
          { title: "Bài 1: Hàm số", preview: true },
          { title: "Bài 2: Hàm số bậc nhất", preview: false },
          { title: "Bài 3: Hàm số bậc hai", preview: false }
        ]
      }
    ],
    instructor: {
      name: "Thầy Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Giáo viên Toán với 15 năm kinh nghiệm giảng dạy",
      students: 5000,
      courses: 8,
      rating: 4.9
    }
  },
  {
    subjectName: "Ngữ Văn lớp 11",
    subtitle: "Khóa học Văn học Việt Nam và Văn học nước ngoài",
    teacher: "Cô Trần Thị B",
    description: "Khóa học giúp học sinh nắm vững kiến thức Văn học lớp 11, bao gồm các tác phẩm văn học Việt Nam và nước ngoài. Học sinh sẽ được học cách phân tích tác phẩm và làm văn nghị luận.",
    price: 399000,
    rating: 4.7,
    reviews: 98,
    students: 850,
    lastUpdated: new Date("2024-03-10"),
    language: "Vietnamese",
    image: "https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg",
    whatYouWillLearn: [
      "Phân tích tác phẩm văn học",
      "Kỹ năng làm văn nghị luận",
      "Hiểu sâu về văn học Việt Nam và nước ngoài",
      "Phát triển khả năng cảm thụ văn học"
    ],
    requirements: [
      "Kiến thức Văn học lớp 10",
      "Khả năng đọc hiểu tốt",
      "Tinh thần học tập chăm chỉ"
    ],
    curriculum: [
      {
        section: "Văn học Việt Nam",
        lectures: [
          { title: "Bài 1: Vào phủ chúa Trịnh", preview: true },
          { title: "Bài 2: Tự tình", preview: false },
          { title: "Bài 3: Câu cá mùa thu", preview: false }
        ]
      },
      {
        section: "Văn học nước ngoài",
        lectures: [
          { title: "Bài 1: Tôi yêu em", preview: true },
          { title: "Bài 2: Người trong bao", preview: false },
          { title: "Bài 3: Người cầm quyền khôi phục uy quyền", preview: false }
        ]
      }
    ],
    instructor: {
      name: "Cô Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Giáo viên Văn với 12 năm kinh nghiệm giảng dạy",
      students: 3000,
      courses: 6,
      rating: 4.8
    }
  }
];

module.exports = lectures; 