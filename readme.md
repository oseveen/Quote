<p align="center">
  <picture>
    <source srcset="./assets/Quote-white-logo.png" media="(prefers-color-scheme: dark)">
    <img src="./assets/Quote-black-logo.png" width="40%" />
  </picture>
</p>

---

<p><strong>Quote</strong> is an intuitive and practical tool designed to simplify the addition of quotes to your Markdown files. It streamlines your workflow, making it quick and efficient to include citations.</p>


<h2>📦 How to usage?</h2>
<p>To use the <strong>Quote</strong> in your project, follow the example below.</p>

```md
<h3>Every day a quote</h3>

<!--- quote@start --->
```

<p>After that, simply create a YAML file in the <code>.github/workflows</code> directory, for example: <code>.github/workflows/quote.yaml</code>, and add the following code:</p>

```yaml
name: Quote Updater

on: 
  schedule:
    - cron: '0 0 * * *' # Run 1x per day
  workflow_dispatch:

permissions: 
  contents: write

jobs:
  Quote:
    name: Update Markdown Quote
    runs-on: ubuntu-latest

    steps:
      # Check out the repository to allow the workflow to access the files
      - name: Checkout repository
        uses: actions/checkout@v4

      # Run the custom Quote workflow to update the markdown with quotes
      - name: Using Quote workflow
        uses: oseveen/Quote@master
```

<details>
    <summary>Quote workflow settings</summary>

| options        | description                      | default       | required |
|----------------|----------------------------------|---------------|----------|
| pathQuote      | path to markdown                 | `./readme.md` | No       |
| typeQuote      | Desired quote type               | `Random`  | No      |
| commitMessage  | Commit message that will be used | `📖 Updating quote in markdown file` | No |
</details>

<details>
    <summary>Quote types</summary>


| Anxiety     | Change     | Choice     | Confidence  | Courage    | Death      | Dreams     | Excellence |
|-------------|------------|------------|-------------|------------|------------|------------|------------|
| Failure     | Fairness   | Fear       | Forgiveness | Freedom    | Future     | Happiness  | Inspiration| Kindness   |
| Leadership  | Life       | Living     | Love        | Pain       | Past       | Success    | Time       
| Today       | Truth      | Work       | Random      |
</details>


<h2>🎉 Finishing</h2>
<p>If you have difficulty using this action, you can see an example of how to use it or even check how it will look in the end by accessing the repository below. <a href="https://github.com/oseveen/oseveen">oseveen/oseveen</a></p>