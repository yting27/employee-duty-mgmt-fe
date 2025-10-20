<template>
  <div>
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          值班管理系统
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/employees" active-class="active">
                <i class="bi bi-people me-1"></i>
                人员
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/schedules" active-class="active">
                <i class="bi bi-calendar-check me-1"></i>
                排班
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>