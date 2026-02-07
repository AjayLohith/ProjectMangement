# Submission Guide - PixelForge Nexus

## 📋 Assignment Submission Requirements

Based on the assignment instructions, here's what you need to submit:

### Required Submission Format

**You need to create a `.docx` file** with the following structure:

#### At the Top of the Document (2 Links):

1. **Link 1**: Complete source code in a Google Drive folder
   - ❌ **DO NOT** zip the files
   - ✅ Upload the entire project folder to Google Drive
   - ✅ Set folder permissions to: **"Anyone with the link can view"**
   - ✅ Copy the shareable link

2. **Link 2**: Video report (8 minutes or less)
   - ✅ Upload video to Google Drive
   - ✅ Set permissions to: **"Anyone with the link can view"**
   - ✅ Copy the shareable link

#### Rest of the Document:

- **Individual Report** (2000 words)
  - System design and security principles
  - Development process
  - Security testing and analysis
  - Formal methods application
  - Test/login credentials

---

## ✅ What to Submit

### 1. Source Code (Google Drive Folder)

**What to include:**
- ✅ Complete source code (all files)
- ✅ README.md
- ✅ Documentation files
- ✅ Test credentials file
- ✅ Environment variable examples
- ✅ Any additional documentation

**What NOT to include:**
- ❌ `node_modules/` folders
- ❌ `.env` files (use `.env.example` instead)
- ❌ Build outputs (`dist/`, `build/`)
- ❌ Log files
- ❌ Uploaded files in `server/uploads/`

**Steps:**
1. Clean your project (remove node_modules, .env, etc.)
2. Create a folder in Google Drive named: `PixelForgeNexus-SourceCode`
3. Upload the entire project folder
4. Set permissions: **"Anyone with the link can view"**
5. Copy the shareable link

### 2. Video Report (Google Drive)

**Video Requirements:**
- ⏱️ **8 minutes or less**
- 🎥 Show fly-through of the system
- 🗣️ Use voice-overs and/or text overlays
- 📹 Highlight significant aspects:
  - System design
  - Security features
  - Functionality demonstration
  - Security testing

**Steps:**
1. Record your video (8 minutes max)
2. Upload to Google Drive
3. Set permissions: **"Anyone with the link can view"**
4. Copy the shareable link

### 3. Written Report (.docx file)

**Report Structure:**
1. **Top of document**: 2 links (source code + video)
2. **Main content** (2000 words):
   - System Design (35%)
   - Security Testing and Analysis (35%)
   - System Development (20%)
   - Formal Methods (10%)
   - Test credentials section

**Include:**
- ✅ Design considerations
- ✅ Security principles applied
- ✅ Development methodology
- ✅ Testing results
- ✅ Test/login credentials

---

## 🚀 Optional: Deployed Link (Bonus)

While **NOT required**, having a deployed link is **HIGHLY RECOMMENDED** because:

✅ **Shows production readiness**
✅ **Demonstrates the system works**
✅ **Makes video demonstration easier**
✅ **Impressive for grading**

### How to Add Deployed Link:

If you deploy to Vercel + Render, you can add a **third link** in your report:

**Link 3 (Optional)**: Live deployed application
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-api.onrender.com`

**Note**: This is optional but recommended. The assignment only requires source code and video links.

---

## 📝 Submission Checklist

### Before Uploading to Google Drive:

- [ ] Remove `node_modules/` folders
- [ ] Remove `.env` files (keep `.env.example`)
- [ ] Remove `dist/` and `build/` folders
- [ ] Remove log files
- [ ] Ensure all documentation is included
- [ ] Test that the code can be downloaded and run

### Google Drive Setup:

- [ ] Source code folder uploaded
- [ ] Video uploaded
- [ ] Both set to "Anyone with the link can view"
- [ ] Links tested (open in incognito to verify)

### Written Report (.docx):

- [ ] Link 1: Source code (at top)
- [ ] Link 2: Video report (at top)
- [ ] Link 3: Deployed app (optional, but recommended)
- [ ] 2000-word report
- [ ] Test credentials included
- [ ] All sections covered

---

## 🎯 Quick Answer to Your Question

**Question**: Should I paste a zip file or deployed link?

**Answer**: 
- ❌ **NO zip file** - Upload source code as a **folder** to Google Drive
- ✅ **YES deployed link** - Optional but highly recommended (add as Link 3)
- ✅ **Required**: Source code folder link + Video link in .docx file

---

## 📦 Preparing Source Code for Upload

Run these commands to clean your project:

```bash
# Remove node_modules
rm -rf node_modules
rm -rf server/node_modules
rm -rf client/node_modules

# Remove build outputs
rm -rf client/dist
rm -rf server/uploads/*

# Remove .env files (keep .env.example)
# Make sure .env is in .gitignore
```

Then upload the cleaned folder to Google Drive.

---

## 📄 Example .docx Structure

```
═══════════════════════════════════════════════════════
PixelForge Nexus - Assignment Submission
═══════════════════════════════════════════════════════

LINKS:
1. Source Code: https://drive.google.com/drive/folders/...
2. Video Report: https://drive.google.com/file/d/...
3. Live Application (Optional): https://your-app.vercel.app

═══════════════════════════════════════════════════════
INDIVIDUAL REPORT (2000 words)
═══════════════════════════════════════════════════════

1. System Design
   - Design principles
   - Security considerations
   - Threat model
   ...

2. Security Testing and Analysis
   - Testing methodology
   - Security measures
   - Test results
   ...

3. System Development
   - Development process
   - Implementation details
   - Code quality
   ...

4. Formal Methods
   - Behavioral models
   - Verification techniques
   ...

5. Test Credentials
   - Admin: admin / password123
   - Lead: lead / password123
   - Dev1: dev1 / password123
   - Dev2: dev2 / password123
```

---

## ✅ Final Steps

1. **Clean your project** (remove unnecessary files)
2. **Upload to Google Drive** (source code folder + video)
3. **Set permissions** ("Anyone with the link can view")
4. **Create .docx file** with links and 2000-word report
5. **Optional**: Deploy to Vercel + Render for live demo
6. **Submit** the .docx file

Good luck with your submission! 🎓

