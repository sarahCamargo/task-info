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

function showCommitInfo() {
  const isGeraCommitDesc = document.getElementById("geraCommitDesc").checked;
  const container = document.getElementById("commitInputContainer");

  if (isGeraCommitDesc) {
    container.innerHTML = `
      <label for="propMelhoria" class="form-label">Proposta de Melhoria</label>
      <textarea rows="5" id="propMelhoria" name="propMelhoria" class="form-control" />
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
  const isGeraCommitDesc = formData.get("geraCommitDesc") !== null;
  const propMelhoria = formData.get("propMelhoria");

  if (!usCod) alert("Informe um código válido.");
  if (!usDesc) alert("Informe uma descrição válida.");
  if (taskType == null) alert("Informe o tipo da task.");
  if (taskType == "feature" && !featCod) alert("Informe um código válido.");
  if (isGeraCommitDesc && !propMelhoria)
    alert("Informe uma proposta de melhoria válida.");

  const mensagem = `PR ${capitalize(taskType)} ${usCod} - ${usDesc}`;
  document.getElementById("mensagem").textContent = mensagem;

  let taskBranch = "";
  let featureBranch = "";

  if (taskType == "feature" && featCod != null) {
    taskBranch = `features/${featCod}/task/${usCod}_${getBranchNameFormatted(
      usDesc
    )}`;
    featureBranch = `features/${featCod}/developer`;
  } else {
    taskBranch = `hotfix/${usCod}_${getBranchNameFormatted(usDesc)}`;
    featureBranch = "";
  }

  document.getElementById("featureBranch").textContent = featureBranch;
  document.getElementById("taskBranch").textContent = taskBranch;
  document.getElementById("resposta").style.display = "block";

  if (isGeraCommitDesc) {
    gerarCommitDescricao(usCod, propMelhoria);
  }
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

function copiarElemento(id) {
  let texto = document.getElementById(id).textContent;

  texto = texto.replace(/<br\s*\/?>/gi, "\n").trim();

  navigator.clipboard.writeText(texto);
}

function gerarCommitDescricao(usCod, propMelhoria) {
  let desc = `
<br>Antes de submeter o PR, tenha certeza que:<br><br>

- [X] O build do código é feito sem erros ou warnings<br>
- [X] O código está formatado e nos padrões de clean code<br>
- [X] Toda a funcionalidade desenvolvida foi devidamente testada.<br><br>

# Proposta de Melhoria<br>
${propMelhoria}<br><br>

# Link da Task com Evidências<br>
#${usCod}`;

  document.getElementById("commitDesc").innerHTML = desc;
  document.getElementById("commit").style.display = "block";
}
