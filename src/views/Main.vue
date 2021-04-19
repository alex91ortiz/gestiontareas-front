<template>
  <div class="main">
    <Navigation />
    <h2>{{ $route.params.id }}</h2>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from '@/components/navigation';

export default {
  name: "Main",
  components: {
    Navigation,
  },
};
</script>
