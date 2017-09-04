/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Platform from 'vs/base/common/platform';
import * as os from 'os';
import { TPromise } from 'vs/base/common/winjs.base';
import * as uuid from 'vs/base/common/uuid';

export const machineIdStorageKey = 'telemetry.machineId';
export const machineIdIpcChannel = 'vscode:machineId';

export function resolveCommonProperties(commit: string, version: string): TPromise<{ [name: string]: string; }> {
	const result: { [name: string]: string; } = Object.create(null);

	// __GDPR__COMMON__ "sessionID" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['sessionID'] = uuid.generateUuid() + Date.now();
	// __GDPR__COMMON__ "commitHash" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['commitHash'] = commit;
	// __GDPR__COMMON__ "version" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['version'] = version;
	// __GDPR__COMMON__ "common.osVersion" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.osVersion'] = os.release();
	// __GDPR__COMMON__ "common.platfrom" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.platform'] = Platform.Platform[Platform.platform];
	// __GDPR__COMMON__ "common.nodePlatform" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.nodePlatform'] = process.platform;
	// __GDPR__COMMON__ "common.nodeArch" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.nodeArch'] = process.arch;

	// dynamic properties which value differs on each call
	let seq = 0;
	const startTime = Date.now();
	Object.defineProperties(result, {
		// __GDPR__COMMON__ "timestamp" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'timestamp': {
			get: () => new Date(),
			enumerable: true
		},
		// __GDPR__COMMON__ "common.timesincesessionstart" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'common.timesincesessionstart': {
			get: () => Date.now() - startTime,
			enumerable: true
		},
		// __GDPR__COMMON__ "common.sequence" : { "endPoint": "none", "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'common.sequence': {
			get: () => seq++,
			enumerable: true
		}
	});

	return TPromise.as(result);
}