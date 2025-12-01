(function () {
  const form = document.getElementById("uxSupportForm");
  const successMessage = document.getElementById("successMessage");
  const roleOtherCheckbox = document.getElementById("roleOther");
  const otherRoleWrapper = document.getElementById("otherRoleWrapper");
  const addStakeholderBtn = document.getElementById("addStakeholderBtn");
  const additionalContainer = document.getElementById("additionalStakeholdersContainer");
  const clearBtn = document.getElementById("clearBtn");
  const submitBtn = document.getElementById("submitBtn");
  const closeBtn = document.getElementById("closeBtn");

  let stakeholderCount = 0;
  const maxStakeholders = 3;

  function updateOtherRoleVisibility() {
    if (roleOtherCheckbox.checked) {
      otherRoleWrapper.style.display = "block";
    } else {
      otherRoleWrapper.style.display = "none";
      document.getElementById("otherRole").value = "";
    }
  }

  roleOtherCheckbox.addEventListener("change", updateOtherRoleVisibility);
  updateOtherRoleVisibility();

  function addStakeholder() {
    if (stakeholderCount >= maxStakeholders) return;
    stakeholderCount++;

    const index = stakeholderCount;
    const block = document.createElement("div");
    block.className = "stakeholder-block";
    block.dataset.index = index;

    block.innerHTML = `
      <div class="stakeholder-block-title">Additional Stakeholder ${index}</div>
      <div class="field-row">
        <div class="field-group">
          <label for="stakeholderName${index}">Name</label>
          <input type="text" id="stakeholderName${index}" class="stakeholder-name" />
        </div>
        <div class="field-group">
          <label for="stakeholderEmail${index}">Email</label>
          <input type="email" id="stakeholderEmail${index}" class="stakeholder-email" />
        </div>
        <div class="field-group">
          <label for="stakeholderPhone${index}">Phone</label>
          <input type="text" id="stakeholderPhone${index}" class="stakeholder-phone" />
        </div>
      </div>
      <button type="button" class="link-button remove-link">Remove this stakeholder</button>
    `;

    const removeBtn = block.querySelector(".remove-link");
    removeBtn.addEventListener("click", function () {
      block.remove();
      stakeholderCount--;
      addStakeholderBtn.disabled = false;
    });

    additionalContainer.appendChild(block);

    if (stakeholderCount >= maxStakeholders) {
      addStakeholderBtn.disabled = true;
    }
  }

  addStakeholderBtn.addEventListener("click", addStakeholder);

  clearBtn.addEventListener("click", () => {
    stakeholderCount = 0;
    additionalContainer.innerHTML = "";
    addStakeholderBtn.disabled = false;
    successMessage.style.display = "none";
    closeBtn.style.display = "none";
  });

  function clearErrors() {
    const allInputs = form.querySelectorAll("input, textarea, select");
    const errorMessages = form.querySelectorAll(".error-message");
    allInputs.forEach((el) => el.classList.remove("error"));
    errorMessages.forEach((msg) => msg.classList.remove("error-visible"));
  }

  function setError(element, messageEl) {
    element.classList.add("error");
    messageEl.classList.add("error-visible");
  }

  function validateRequired(id) {
    const field = document.getElementById(id);
    const msg = field.nextElementSibling;
    if (!field.value.trim()) {
      setError(field, msg);
      return false;
    }
    return true;
  }

  function validateEmail(id) {
    const field = document.getElementById(id);
    const msg = field.nextElementSibling;
    const value = field.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailPattern.test(value)) {
      setError(field, msg);
      return false;
    }
    return true;
  }

  function validateRoles() {
    const rolesGroup = document.getElementById("rolesGroup");
    const rolesError = rolesGroup.parentElement.querySelector(".error-message");
    const rolesChecked = rolesGroup.querySelectorAll('input[type="checkbox"]:checked');
    if (rolesChecked.length === 0) {
      rolesError.classList.add("error-visible");
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.style.display = "none";
    closeBtn.style.display = "none";

    clearErrors();

    let firstErrorElement = null;

    function checkRequired(id) {
      if (!validateRequired(id)) {
        if (!firstErrorElement) firstErrorElement = document.getElementById(id);
      }
    }

    function checkEmail(id) {
      if (!validateEmail(id)) {
        if (!firstErrorElement) firstErrorElement = document.getElementById(id);
      }
    }

    checkRequired("name");
    checkEmail("email");
    checkRequired("org");

    checkRequired("projectName");
    checkRequired("projectDescription");

    checkRequired("problem");
    checkRequired("targetUsers");
    checkRequired("goals");

    checkRequired("rolesCount");
    if (!validateRoles()) {
      if (!firstErrorElement) {
        firstErrorElement = document.querySelector("#rolesGroup input[type='checkbox']");
      }
    }

    checkRequired("startDate");
    checkRequired("endDate");
    checkRequired("flexible");
    checkRequired("priority");

    if (firstErrorElement) {
      firstErrorElement.focus({ preventScroll: false });
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    successMessage.style.display = "block";
    closeBtn.style.display = "inline-block";

    const controls = form.querySelectorAll("input, textarea, select, button.link-button");
    controls.forEach((el) => {
      el.disabled = true;
    });

    clearBtn.style.display = "none";
    submitBtn.style.display = "none";
  });

  // Close & Return
  closeBtn.addEventListener("click", function () {
    window.close();
    window.location.href = "https://keelworks.org/";
  });
})();
