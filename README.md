# rdm-virtual-data-crate

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0//?style=for-the-badge)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg?logo=github/?style=for-the-badge)]()
[![UCL ARC](https://img.shields.io/badge/UCL-Advanced_Research_Computing-darkblue)](https://www.ucl.ac.uk/advanced-research-computing/?style=for-the-badge)

**A browser-based sandbox for teaching FAIR data management, file naming conventions, and directory organization.**

## 📖 Overview

**rdm-virtual-data-crate** is an interactive web application designed for Research Data Management (RDM) training. It provides a "virtual" file explorer in the browser where learners can practice renaming files, reorganizing folder structures, and applying naming conventions.

Because the environment is virtual, students can make mistakes, delete "files," and experiment without any risk to actual research data.

## ✨ Key Features

* **Zero Installation:** Runs entirely in the client-side browser.
* **State Persistence:** User progress is saved automatically to local storage. Closing the tab or browser does not lose the current state of the crate.
* **Automated Scoring:** Validates the folder structure against institutional rules and highlights specific errors.
* **Customizable Scenarios:** Institutions can load their own "messy data" scenarios via `CSV`.
* **Theming:** Accessible UI with Light, Dark, and Modern themes.

## 🛠️ The Student Workflow

The application features a toolbar at the bottom left containing the core controls for the training session:

### ℹ️ Information
Displays details about the application version and current configuration.

### ⚙️ Settings
Allows the user to customize the interface appearance. Available themes:
* **Light:** Standard high-contrast interface.
* **Dark:** For low-light environments.
* **Modern:** A sleek, updated interface style.

### ✅ Validate
The core learning tool. When clicked, this runs the organization's scoring metric against the current state of the Virtual Crate.
* **Score:** Returns a pass/fail or percentage score.
* **Feedback:** visually **highlights** specific files or folders that do not meet the naming conventions (e.g., files containing spaces, incorrect date formats) so the student knows exactly what to fix.

### 🔄 Reset FS
Resets the Virtual Data Crate back to the default "messy" state defined in the configuration.
* *Warning:* This wipes all current progress and reorganization done by the user.

## ⚙️ Configuration for Instructors

This tool is designed to be white-labeled and adapted by different institutions. You can customize the experience by editing two files in the repository:

### 1. `info.md` (Branding & Instructions)
Edit this file to change the sidebar content - `assets/info.md`.
* Add your specific institutional branding.
* Paste your file naming guidelines (e.g., "Files must follow `YYYYMMDD_Project_Type.ext`").
* extend the content with additional instructions or resources for learners.

### 2. `assets/filenames_org.csv` (The Scenario)
This `CSV` file defines the initial file system structure presented to the user. Use this to create specific training scenarios (e.g., a folder full of duplicate files and unclear version numbers).

**CSV Structure:**
```csv
~/folder/filename.ext
~/folder02/anotherfile_v2.ext
~/folder03/subfolder/file 2023-01-01.ext
~/junk/file with spaces.ext
```

### 3. 🚀 Deployment

The tool is a static web application and can be hosted via GitHub Pages, Netlify, or Vercel.

* Fork this repository.

* Navigate to **Settings > Pages**.

* Select the `main` branch as the source.

Your custom training tool is now live.


# Example Scenario
The following example represents a genomics research project with common file naming and organization issues.
`assets/filenames_org.csv`
```csv
/Project_Genomics_X
/Project_Genomics_X/Raw Data
/Project_Genomics_X/Raw Data/Batch1
/Project_Genomics_X/Raw Data/Batch1/S1_L001_R1_001.fastq.gz
/Project_Genomics_X/Raw Data/Batch1/S1_L001_R2_001.fastq.gz
/Project_Genomics_X/Raw Data/Batch1/S2_L001_R1_001.fastq.gz
/Project_Genomics_X/Raw Data/Batch1/S2_L001_R2_001.fastq.gz
/Project_Genomics_X/Raw Data/Run_Nov2024
/Project_Genomics_X/Raw Data/Run_Nov2024/sample_3_read1.fq.gz
/Project_Genomics_X/Raw Data/Run_Nov2024/sample_3_read2.fq.gz
/Project_Genomics_X/Raw Data/sample_01_R1.fastq.gz
/Project_Genomics_X/Raw Data/sample_01_R2.fastq.gz
/Project_Genomics_X/Raw Data/sample sheet.csv
/Project_Genomics_X/Analysis
/Project_Genomics_X/Analysis/alignment.bam
/Project_Genomics_X/Analysis/variant_calling_final.vcf
/Project_Genomics_X/Analysis/variant_calling_OLD.vcf
/Project_Genomics_X/Analysis/IGV_snapshot.png
/Project_Genomics_X/lab_meeting_notes_final_v2.docx
/Project_Genomics_X/readme.txt
```

## Scenario Breakdown for the Student
Since this format lacks the "Description" field, you might want to list the Training Objectives in the accompanying info.md sidebar so they know what to look for:

**Standardize Extensions**: Locate `.fq.gz` files and rename them to `.fastq.gz` to match the others (or vice versa).

**Fix Dates**: Rename the `Run_Nov2024` folder to `ISO` format` (e.g., `2024-11_Run`).

**Remove Spaces**: Fix `Raw Data` and `sample sheet.csv` (e.g., use underscores).

**Organize Orphans**: Move the loose `sample_01...` files into a specific batch folder.

**Clean Up**: Delete or archive the `_OLD` VCF file.



# 🤝 Contributing

Contributions are welcome! I am  particularly interested in new regex-based validation rules or new training scenarios.

# 📜 License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

📧 Contact
Nicholas Owen - Principal Research Data Steward, UCL ARC.

---












































# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
