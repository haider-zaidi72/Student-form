
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

const tbody = document.getElementById('studentTableBody');

  async function loadStudents() {
    const { data, error } = await client
      .from('students')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ fetch error:', error.message);
      return;
    }

    // rows render: put id on <tr>, buttons inside last <td>
    tbody.innerHTML = data.map(st => `
      <tr data-id="${st.id}">
        <td>${st.roll_no}</td>
        <td><img src="${st.image ? 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/student-images/' + st.image : 'https://via.placeholder.com/40'}" alt="profile"></td>
        <td>${st.fullname}</td>
        <td>${st.phone}</td>
        <td>${st.cnic}</td>
        <td>${st.campus}</td>
        <td>${st.gender}</td>
        <td>${st.course}</td>
        <td>Pending</td>
        <td>
          <button type="button" class="btn btn-sm btn-info viewBtn"><i class="bi bi-eye"></i></button>
          <button type="button" class="btn btn-sm btn-warning editBtn"><i class="bi bi-pencil"></i></button>
          <button type="button" class="btn btn-sm btn-danger deleteBtn"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // ✅ SINGLE delegated handler — works for dynamic rows
  tbody.addEventListener('click', async (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;

    if (e.target.closest('.viewBtn')) {
      console.log('VIEW', id);
      const { data, error } = await client.from('students').select('*').eq('id', id).single();
      if (error) return alert('Error: ' + error.message);
      alert(`👤 ${data.fullname}\n📞 ${data.phone}\n📧 ${data.email}\n🎓 ${data.course}`);
    }

    if (e.target.closest('.editBtn')) {
      console.log('EDIT', id);
      const currentPhone = tr.children[3].textContent.trim();
      const newPhone = prompt('Enter new phone number:', currentPhone);
      if (!newPhone) return;
      const { error } = await client.from('students').update({ phone: newPhone }).eq('id', id);
      if (error) return alert('Update failed: ' + error.message);
      await loadStudents();
    }

    if (e.target.closest('.deleteBtn')) {
      console.log('DELETE', id);
      if (!confirm('Delete this student?')) return;
      const { error } = await client.from('students').delete().eq('id', id);
      if (error) return alert('Delete failed: ' + error.message);
      tr.remove(); // instant UI update
    }
  });

  // initial data
  loadStudents();
//==================================================================== 

// Edit button handler (inside tbody event listener)
document.getElementById("studentTableBody").addEventListener("click", async (e) => {
  if (e.target.closest('.editBtn')) {
    const id = e.target.closest('.editBtn').dataset.id;

    let { data, error } = await client
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return alert('Error fetching student: ' + error.message);
    }

    console.log("Student fetched:", data);
    // ab yahan modal open karke saari fields editable bana sakte ho
  }
});


// Save changes on form submit
document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('edit_id').value;

  const updatedData = {
    fullname: document.getElementById('edit_fullname').value,
    roll_no: document.getElementById('edit_roll_no').value,
    phone: document.getElementById('edit_phone').value,
    cnic: document.getElementById('edit_cnic').value,
    email: document.getElementById('edit_email').value,
    campus: document.getElementById('edit_campus').value,
    gender: document.getElementById('edit_gender').value,
    course: document.getElementById('edit_course').value,
  };

  const { error } = await client.from('students').update(updatedData).eq('id', id);
  if (error) {
    alert('Update failed: ' + error.message);
    return;
  }

  // Close modal & reload table
  bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();
  loadStudents();
});

document.getElementById("studentTableBody").addEventListener("click", async (e) => {
  if (e.target.closest(".editBtn")) {
    const id = e.target.closest(".editBtn").dataset.id;
    let { data, error } = await db.from("students").select("*").eq("id", id).single();
    console.log(data);
  }
});
