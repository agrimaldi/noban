TESTS = test/*.test.js

test:
	@./node_modules/.bin/vows \
		$(TEST_FLAGS) \
		$(TESTS)

test-spec:
	@$(MAKE) TEST_FLAGS="--spec"


.PHONY: test test-spec
