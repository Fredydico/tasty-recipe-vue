<template>
  <main>
    <div class="container-md my-5 py-5">
      <recipe-form 
      v-if="detailData && !isLoading" 
      :isEdit="true"></recipe-form>
    </div>
  </main>
</template>

<script setup>
    import RecipeForm from '../recipeForm/RecipeForm.vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';

    const store = useStore()
    const route = useRoute()
    const detailData = ref()
    const isLoading = ref(false)

    onMounted(async () => {
        isLoading.value = true
        try {
            // Get id dari dynamic route
            const recipeId = route.params.id;
            // Fetch recipe detail dari store vuex
            await store.dispatch("recipe/getRecipeDetail", recipeId);
            // Store data ke dalam recipeData
            // console.log(recipeId);
            detailData.value = store.state.recipe.recipeDetail;
            // console.log(detailData.value);
            // console.log(store.state);
            isLoading.value = false;
        } catch (err) {
            console.error(err);
        }
    })
    
</script>
