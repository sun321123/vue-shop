<template>
  
  <router-link to="/login"></router-link>
  <router-view/>
</template>

<style>

body,html{
  padding:0;
  margin:0;
}
/* flex布局类名 */
.flex-float{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex{
  display: flex;
  align-items: center;
}
</style>