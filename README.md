# 🎓 CampusNav — FH Münster Steinfurt

An AI-powered campus navigation app for students at FH Münster Technologie-Campus Steinfurt. Find rooms, navigate buildings, and ask questions in German or English.

> **Live Demo:** [campus-nav-chi.vercel.app](https://campus-nav-chi.vercel.app)

![React Native](https://img.shields.io/badge/React_Native-Expo-0EA5E9?logo=expo)
![AI](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-10B981?logo=meta)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## ✨ Features

- **🗺️ Campus Map** — All buildings at Stegerwaldstraße 39 with room details
- **🔍 Room Finder** — Search any room by number, type, or description
- **🤖 AI Assistant** — Ask questions in German or English, powered by LLaMA 3.3
- **ℹ️ Campus Info** — Opening hours, contacts, transport, and useful links

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/Web | React Native + Expo |
| AI | Groq API (LLaMA 3.3 70B) |
| Navigation | React Navigation (Bottom Tabs) |
| Deployment | Vercel (Web) + Expo Go (Mobile) |

## 🚀 Getting Started

```bash
git clone https://github.com/Moameira/CampusNav.git
cd CampusNav
npm install
```

Create a `.env` file:
EXPO_PUBLIC_GROQ_API_KEY=your_groq_key_here

Then run:
```bash
npx expo start
```

- Press `w` for web browser
- Scan QR code with Expo Go for mobile

## 📱 Mobile Testing

Download **Expo Go** from the App Store and scan the QR code from `npx expo start`.

## 🗺️ Campus Coverage

- **9 buildings** mapped with room details
- **30+ rooms** searchable by name, type, and description  
- **Quick access** to Bibliothek, Mensa, Prüfungsamt, AStA
- **AI answers** questions about locations, directions, and opening hours

## 👤 Author

**Mohamed Ameira**  
Computer Science Student @ FH Münster  
[LinkedIn](https://linkedin.com/in/mohamed-ameira-8122b31a7) · [GitHub](https://github.com/Moameira)

> Built to solve a real problem — getting lost on campus as a first-year student.