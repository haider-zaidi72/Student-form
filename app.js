
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

// =================== Modal Controls ===================
const enrollBtn = document.getElementById("enrollBtn");
const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");
const studentForm = document.getElementById("studentForm");

enrollBtn.addEventListener("click", () => {
  studentModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  studentModal.style.display = "none";
});

// =================== Roll Number Generator ===================
async function generateRollNo(campus) {
  let prefix = "";
  switch(campus) {
    case "Gulshan": prefix = "G"; break;
    case "Korangi": prefix = "K"; break;
    case "Nazimabad": prefix = "N"; break;
    case "Defence": prefix = "D"; break;
    default: prefix = "X"; break;
  }

  // last roll no fetch
  const { data, error } = await client
    .from("students")
    .select("roll_no")
    .ilike("roll_no", `${prefix}-%`)
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("❌ Roll No Fetch Error:", error.message);
    return `${prefix}-0001`;
  }

  if (!data || data.length === 0) return `${prefix}-0001`;

  const lastRoll = data[0].roll_no;
  const lastNum = parseInt(lastRoll.split("-")[1]);
  const newNum = (lastNum + 1).toString().padStart(4, "0");
  return `${prefix}-${newNum}`;
}

// =================== Form Submit Handler ===================
studentForm.addEventListener("submit", async function(e) {
  e.preventDefault(); // reload prevent

  const formData = new FormData(studentForm);
  const student = Object.fromEntries(formData.entries());

  // Roll number generate
  student.roll_no = await generateRollNo(student.campus);

  // Image name store (optional)
  if (formData.get("image") && formData.get("image").name) {
    student.image = formData.get("image").name;
  } else {
    student.image = "";
  }

  // =================== LocalStorage Save ===================
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
  console.log("✅ LocalStorage Save:", students);

  // =================== Supabase Insert ===================
  const { data, error } = await client.from("students").insert([student]);

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    alert("Error saving data to Supabase!");
  } else {
    console.log("✅ Supabase Insert Success:", data);
    alert(`Student enrolled successfully! Roll No: ${student.roll_no}`);
    studentForm.reset();
    studentModal.style.display = "none";
  }
});

// =================== Close modal on outside click ===================
window.addEventListener("click", (e) => {
  if (e.target === studentModal) studentModal.style.display = "none";
});
