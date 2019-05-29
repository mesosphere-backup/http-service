# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.3.0"></a>
# [2.3.0](https://github.com/dcos-labs/http-service/compare/v2.2.0...v2.3.0) (2019-05-29)


### Features

* expose reponse header ([8674173](https://github.com/dcos-labs/http-service/commit/8674173))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/dcos-labs/http-service/compare/v2.1.0...v2.2.0) (2019-05-28)


### Features

* expose reponse type on requests ([a17a94b](https://github.com/dcos-labs/http-service/commit/a17a94b))
* expose response type on requests ([#28](https://github.com/dcos-labs/http-service/issues/28)) ([4d203ec](https://github.com/dcos-labs/http-service/commit/4d203ec))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/dcos-labs/http-service/compare/v2.0.1...v2.0.2) (2019-02-19)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/dcos-labs/http-service/compare/v2.0.0...v2.0.1) (2019-02-15)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/dcos-labs/http-service/compare/v1.1.0...v2.0.0) (2018-12-19)


### Chores

* **rxjs:** update rxjs to latest version ([cc2077c](https://github.com/dcos-labs/http-service/commit/cc2077c))


### BREAKING CHANGES

* **rxjs:** RxJS is updated in a major version, all clients need to
update their version as well

Closes DCOS-46037.



<a name="1.1.0"></a>
# [1.1.0](https://github.com/dcos-labs/http-service/compare/v1.0.0...v1.1.0) (2018-12-18)


### Features

* **request:** fingerprint url ([d010d77](https://github.com/dcos-labs/http-service/commit/d010d77))
* **stream:** fingerprint url ([c40ad86](https://github.com/dcos-labs/http-service/commit/c40ad86))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/dcos-labs/http-service/compare/v0.3.0...v1.0.0) (2018-08-27)


### Features

* **request:** add status code to next event ([c8bc7b5](https://github.com/dcos-labs/http-service/commit/c8bc7b5))


### BREAKING CHANGES

* **request:** the output format of the next event changed. Instead of
`request(...).subscribe({next(response) {...}})` you can now write
`request(...).subscribe({next({ code, response }) {...}})`



<a name="0.3.0"></a>
# [0.3.0](https://github.com/dcos-labs/http-service/compare/v0.2.1...v0.3.0) (2018-03-27)


### Bug Fixes

* adjust connection handling ([1848ce5](https://github.com/dcos-labs/http-service/commit/1848ce5))


### Features

* add response body to errors ([d261a2a](https://github.com/dcos-labs/http-service/commit/d261a2a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/dcos-labs/http-service/compare/v0.2.0...v0.2.1) (2017-12-14)



<a name="0.2.0"></a>
# 0.2.0 (2017-11-24)


### Features

* **http-service:** release http-service ([70e1df6](https://github.com/dcos-labs/http-service/commit/70e1df6))
