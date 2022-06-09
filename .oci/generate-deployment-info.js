const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const start = process.env.timestamp_start;
const end = child_process.execFileSync('date', [ '-u', '+%s.%N' ]).toString('ascii').trimEnd();

fs.writeFileSync(path.resolve(__dirname, 'info.json'), JSON.stringify({
	image: {
		name: process.env.image_name,
		tag: process.env.git_tag,
		uuid: process.env.uuid,
		build_time: {
			start: start,
			end,
			elapsed: (parseFloat(end) - parseFloat(start)).toFixed(9),
		},
		system: {
			operating_system: process.env.operating_system,
			distribution: process.env.distribution,
			machine_architecture: process.env.machine_architecture,
			user: process.env.user,
			hostname: process.env.hostname,
			mac_address: process.env.mac_address,
			kernel: {
				name: process.env.kernel_name,
				release: process.env.kernel_release,
				version: process.env.kernel_version,
			},
			software: {
				name: 'buildah',
				...JSON.parse(Buffer.from(process.env.buildah_version_base64, 'base64').toString('utf8')),
			},
		},
		source: {
			type: 'git',
			repository: {
				name: process.env.git_repository_name,
				owner: process.env.github_owner_name,
				tag: process.env.git_tag,
			}
		},
		registry: {
			type: 'ecr',
			repository: {
				region: process.env.ecr_registry_region,
				uri: process.env.ecr_registry_uri,
			}
		}
	}
}), 'utf8');
