import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
//import csvA from './abc.csv?raw';
//import shaderString from './abc.csv?raw'
//const modules = import.meta.glob('./*.csv');
//const aabb = import.meta.glob( './abc.csv?raw');//, {query:'?raw'});


//console.log('aabbzz112' );

export default defineConfig({ 
    plugins: [sveltekit()],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },	
	build :{
		target:'esnext',
	}
});

