<template>
  <div class="test">

    <div class="content">

      <div class="btn">
        <div class="btn-content">this is a filter btn</div>

      </div>

    </div>


  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
/*https://i.picsum.photos/id/1038/200/300.jpg?hmac=YkU1czWdP8PVibbjnh2YFlQZVnacHSntbpt41mgiXGU*/
/*https://picsum.photos/200/300*/
.test {
  background-image: url("https://i.picsum.photos/id/45/1000/1000.jpg?hmac=twLN3EFOaNXtiZThK-ldf0lKDvv6FlOv7D4a4seLo34");
  overflow: hidden;
  position: relative;
}
.content{
  position: relative;
  /*top: 300px;*/
  /*left: 200px;*/
  margin-left: 200px;
  margin-top: 300px;
  width: 1000px;
  height: 1000px;
  background-image: url("https://i.picsum.photos/id/45/1000/1000.jpg?hmac=twLN3EFOaNXtiZThK-ldf0lKDvv6FlOv7D4a4seLo34");
  /*background-attachment: fixed;*/
  transform: translateX(1px);

}
.btn{
  position: relative;
  top: 100px;
  left: 20px;
  box-shadow: 0 0 10px 0 #000;
  width: 300px;
  height: 300px;

}
.btn-content{
  position: relative;
}
.btn:before{
  content: "";
  background-image: url("https://i.picsum.photos/id/45/1000/1000.jpg?hmac=twLN3EFOaNXtiZThK-ldf0lKDvv6FlOv7D4a4seLo34");
  background-attachment: scroll;
  /*background: red;*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>