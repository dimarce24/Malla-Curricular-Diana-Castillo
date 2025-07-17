
let courses = [];
let approved = new Set(JSON.parse(localStorage.getItem("approvedCourses") || "[]"));

fetch("./courses.json")
  .then(res => res.json())
  .then(data => {
    courses = data;
    renderCourses();
  });

function renderCourses() {
  const container = document.getElementById("curriculum");
  container.innerHTML = "";

  const semesters = [...new Set(courses.map(c => c.semester))].sort((a, b) => a - b);
  semesters.forEach(sem => {
    const semBlock = document.createElement("div");
    semBlock.className = "bg-white rounded-xl shadow-md p-4";
    semBlock.innerHTML = `<h2 class="text-xl font-bold mb-2">Semestre ${sem}</h2>`;

    const list = document.createElement("div");
    list.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3";

    courses.filter(c => c.semester == sem).forEach(course => {
      const isApproved = approved.has(course.id);
      const prereqMet = course.prerequisites.every(pr => approved.has(pr));
      const isAvailable = prereqMet || isApproved;

      const card = document.createElement("div");
      card.className = \`p-4 border rounded-lg transition cursor-pointer \${isApproved ? 'bg-green-200' : isAvailable ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-200 opacity-50 cursor-not-allowed'}\`;
      card.innerHTML = \`<strong>\${course.name}</strong>\`;

      if (isAvailable) {
        card.addEventListener("click", () => toggleApproval(course.id));
      }

      list.appendChild(card);
    });

    semBlock.appendChild(list);
    container.appendChild(semBlock);
  });
}

function toggleApproval(id) {
  if (approved.has(id)) {
    approved.delete(id);
  } else {
    approved.add(id);
  }
  localStorage.setItem("approvedCourses", JSON.stringify([...approved]));
  renderCourses();
}

function resetProgress() {
  localStorage.removeItem("approvedCourses");
  approved.clear();
  renderCourses();
}
