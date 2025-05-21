function toggleFeatureField() {
  const isFeature = document.getElementById("feature").checked;
  const container = document.getElementById("featureInputContainer");

  if (isFeature) {
    container.innerHTML = `
      <label for="featCod" class="form-label">Código Feature</label>
      <input type="number" id="featCod" name="featCod" class="form-control" />
    `;
  } else {
    container.innerHTML = "";
  }
}

function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const usCod = formData.get("usCod");
  const featCod = formData.get("featCod");
  const usDesc = formData.get("usDesc");
  const taskType = formData.get("taskType");

  if (!usCod) alert("Informe um código válido.");
  if (!usDesc) alert("Informe uma descrição válida.");
  if (taskType == null) alert("Informe o tipo da task.");
  if (taskType == "feature" && !featCod) alert("Informe um código válido.");

  const mensagem = `PR ${capitalize(taskType)} - ${usDesc}`;
  document.getElementById("mensagem").textContent = mensagem;

  let taskBranch = "";
  let featureBranch = "";

  if (taskType == "feature" && featCod != null) {
    taskBranch = `features/${featCod}/task/${usCod}_${getBranchNameFormatted(usDesc)}`;
    featureBranch = `features/${featCod}/developer`;
  } else {
    taskBranch = `hotfix/${usCod}_${getBranchNameFormatted(usDesc)}`;
    featureBranch = "";
  }

  document.getElementById("featureBranch").textContent = featureBranch;
  document.getElementById("taskBranch").textContent = taskBranch;
  document.getElementById("resposta").style.display = "block";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getBranchNameFormatted(desc) {
  return desc
    .replace(/\s+/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
