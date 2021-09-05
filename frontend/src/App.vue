<template>
  <div class="bg-primary">

    <!-- <Navbar /> -->

    <div class="container text-center mx-auto">


        <main class=" lg:px-md-4">

          <keep-alive>
            <router-view />
          </keep-alive>

        </main>
    </div>

  </div>
</template>

<script>
// import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    // Navbar,
  }
}
</script>
