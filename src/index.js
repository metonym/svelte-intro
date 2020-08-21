import App from "./App.svelte";

// Article URLs from the IBM Corporate Social Responsibility blog
// https://www.ibm.com/blogs/corporate-social-responsibility/
const urls = [
  "https://www.ibm.com/blogs/corporate-social-responsibility/2020/08/ibm-service-corps-uses-predictive-analytics-to-find-lead-in-drinking-water-pipes/",
  "https://www.ibm.com/blogs/corporate-social-responsibility/2020/06/colombias-pionerasdev-wins-ibm-open-source-community-grant-to-increase-programming-by-women/",
  "https://www.ibm.com/blogs/corporate-social-responsibility/2020/06/redesigning-high-school/",
];

const github_repo = "https://github.com/metonym/svelte-intro";

const app = new App({
  target: document.body,
  props: {
    urls,
    github_repo,
  },
});
