const form = document.getElementById("form");
const area = form.querySelector('textarea[name="motivation"]');
const count = document.getElementById("count");

area.addEventListener("input", () => {
  count.textContent = area.value.length;
});

const SUPABASE_URL = "https://htlzhrihaokkymnpzwyd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHpocmloYW9ra3ltbnB6d3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzM3MDMsImV4cCI6MjA3NjI0OTcwM30.emPdJkv7e8X6h90RfztwpwJtZpOZOVOaO8KWkfjIdYM";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  for (let key in data) {
    if (typeof data[key] === "string") data[key] = data[key].trim();
  }
  let errors = [];
  if (!data.name) errors.push("Full Name");
  if (!data.email) errors.push("College Email");
  if (!data.branch || data.branch === "" || data.branch === "Select Your Branch") errors.push("Branch");
  if (!data.reg) errors.push("Registration Number");
  if (!data.phone) errors.push("Phone Number");
  if (!data.priority) errors.push("Priority (1-5)");
  if (!data.motivation) errors.push("Motivation");
  if (!data.domain || data.domain === "" || data.domain === "Select Your Domain") errors.push("Domain");
  let formatErrors = [];
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) formatErrors.push("College Email must be valid");
  if (data.phone && !/^\d{10}$/.test(data.phone)) formatErrors.push("Phone Number must be 10 digits");
  if (data.priority && !(Number(data.priority) >= 1 && Number(data.priority) <= 5)) formatErrors.push("Priority must be between 1 and 5");
  if (errors.length > 0 || formatErrors.length > 0) {
    let msg = "";
    if (errors.length > 0) msg += "Please fill the following required fields: " + errors.join(", ");
    if (formatErrors.length > 0) msg += (msg ? "\n" : "") + formatErrors.join("\n");
    alert(msg);
    return;
  }
  const { error } = await supabase
    .from('formSubmissions')
    .insert([
      {
        name: data.name,
        'college-email': data.email,
        branch: data.branch,
        'reg-no': data.reg,
        'phone-no': data.phone,
        priority: data.priority,
        'why-to-join': data.motivation,
        domain: data.domain,
        project: data.project || null
      }
    ]);
  if (error) {
    alert('Failed to submit form:\n' + error.message);
  } else {
    alert('Data submitted successfully!');
    form.reset();
    count.innerText = '0';
  }
});
