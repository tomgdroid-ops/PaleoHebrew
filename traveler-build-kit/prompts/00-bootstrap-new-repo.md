# Prompt 00 — Move the Wayfarer kit into its own repository

Run this in a Claude Code session opened in an EMPTY folder on my Windows
machine (for example `C:\dev\wayfarer`), in a terminal opened as Administrator.
It has nothing to do with any other project; it only sets up a new synth repo.

## What to do

1. Fetch the build kit. It currently lives on a side branch of another repo.
   Do a shallow, single-branch clone into a temporary folder and copy only the
   kit out of it:

   ```bat
   git clone --depth 1 --branch claude/traveler-vst-research-pj8ihm --single-branch https://github.com/tomgdroid-ops/PaleoHebrew.git %TEMP%\wf-kit
   ```

   Then copy `%TEMP%\wf-kit\traveler-build-kit\` into the current folder as
   follows, and delete `%TEMP%\wf-kit` afterwards:

   ```
   docs\SPEC.md            <- traveler-build-kit\SPEC.md
   docs\PARAMETERS.md      <- traveler-build-kit\PARAMETERS.md
   docs\PRESETS.md         <- traveler-build-kit\PRESETS.md
   docs\UI-MOCKUP.html     <- traveler-build-kit\ui\UI-MOCKUP.html
   docs\UI-MOCKUP.png      <- traveler-build-kit\ui\UI-MOCKUP.png
   docs\KIT-README.md      <- traveler-build-kit\README.md
   prompts\*.md            <- traveler-build-kit\prompts\*.md   (all 13, plus this one)
   ```

   Do not copy `ALL-PROMPTS.md` or the zip; they are duplicates.

   If the clone fails because the branch is gone, stop and tell me; I have the
   zip (`wayfarer-build-kit.zip`) and will drop it in this folder for you to
   unzip into the same layout instead.

2. Initialise the repository here: `git init -b main`, add a `.gitignore` with
   `build*/`, `.vs/`, `*.user`, `_deps/`, and a short root `README.md` that says
   this is Wayfarer, a JUCE hybrid synth built from the prompts in `prompts/`,
   pointing at `docs/KIT-README.md` for setup and compile instructions.

3. Commit: `Import Wayfarer build kit`.

4. Create the GitHub repository `tomgdroid-ops/wayfarer-synth` as **private**
   and push `main` to it. Use `gh repo create tomgdroid-ops/wayfarer-synth --private --source . --push`
   if the GitHub CLI is installed and logged in; otherwise create it through the
   GitHub MCP tools or tell me to create it on github.com and give you the URL,
   then `git remote add origin <url>` and `git push -u origin main`.

5. Verify the toolchain from `docs/KIT-README.md` section 1 is present:
   run `cmake --version`, `git --version`, and check that Visual Studio 2022 with
   the C++ workload is installed (look for `vswhere` under
   `C:\Program Files (x86)\Microsoft Visual Studio\Installer\`). Report what is
   missing, with the install link for each, but do not install anything.

6. Print a short summary: the repo URL, the file tree, and the toolchain check.
   Then stop. The next step is a NEW session in this folder with `prompts\01-scaffold.md`.

## Done when

- `docs\` holds the five kit documents and the mockup, `prompts\` holds 00-13.
- `git log` shows one commit on `main`, pushed to `tomgdroid-ops/wayfarer-synth`.
- The toolchain report is printed.
