
import 'dotenv/config';


const deployUrl = process.env.DEPLOY_URL_TRIGGER;

if (!deployUrl) {
  console.error("DEPLOY_URL_TRIGGER is not defined in the environment variables.");
  process.exit(1);
}

fetch(deployUrl, {
  method: "POST",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to trigger deployment: ${response.statusText}`);
    }
    console.log("Deployment triggered successfully.");
  })
  .catch((error) => {
    console.error("Error triggering deployment:", error);
    process.exit(1);
  });
