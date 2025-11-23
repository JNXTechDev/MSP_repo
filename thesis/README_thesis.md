Thesis build and reproduction instructions

This folder contains a LaTeX thesis draft `thesis.tex` that summarizes the MSP project and embeds experiment results and references to plots in `backend/experiments_out`.

Preconditions
- A working TeX toolchain (e.g., TeX Live or MiKTeX) installed on your machine.
- Python virtualenv with project dependencies installed (see `backend/requirements.txt`).

Build steps (Windows PowerShell):

```powershell
cd C:\THESIS\MSP\thesis
pdflatex -interaction=nonstopmode thesis.tex
# Run twice if there are table-of-contents or references updates
pdflatex -interaction=nonstopmode thesis.tex
```

If images are not found, ensure the relative paths in `thesis.tex` to `../backend/experiments_out/*.png` are correct relative to the thesis directory.

Reproduce experiments

From `C:\THESIS\MSP\backend` (activate your venv first):

```powershell
# Train canonical pipelines
.\venv\Scripts\python.exe .\train_full.py --target-size 39154 --C 1.0 --calib-cv 5

# Evaluate saved pipeline
.\venv\Scripts\python.exe .\scripts\evaluate_enhanced.py

# Run diagnostic scripts
.\venv\Scripts\python.exe .\scripts\leak_check.py
.\venv\Scripts\python.exe .\scripts\test_api.py
```

Notes
- The thesis references figures saved to `backend/experiments_out`. If you re-run experiments, regenerate those plots or update the file paths.
- There is an evaluation discrepancy documented in the thesis: `train_full_results.json` reports perfect enhanced model performance for a particular run, but a later re-evaluation of the pickled pipeline returned poor accuracy. The thesis recommends re-running `train_full.py` end-to-end and re-evaluating immediately after saving to avoid such mismatches.

Contact
- If you want me to compile the PDF here, I can attempt to run `pdflatex`, but a full TeX toolchain is required on this machine. Otherwise follow the steps above locally.
