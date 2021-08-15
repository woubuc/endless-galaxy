import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TypedRefMixin extends Vue {

	$ref<T = unknown>(ref : string) : T {
		return this.$refs[ref] as unknown as T;
	}

}
