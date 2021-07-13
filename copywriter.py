"""Writes copyright notices to dist files from source files."""

import os

# Get relative paths to each source file.
sources = os.listdir("./frontend/scripts/src")
sources = [os.path.join(".", "frontend", "scripts", "src", filename) for filename in sources]
sources.sort()

# Get relative paths to each dist file.
dists = os.listdir("./frontend/scripts/dist")
dists = [os.path.join(".", "frontend", "scripts", "dist", filename) for filename in dists]
dists.sort()

# Prepend the copyright notices.
for source, dist in zip(sources, dists):
  with open(source) as f:
    copyright_notice = f.readlines()[0:4]
  with open(dist, "r") as original_dist:
    data = original_dist.read()
  with open(dist, "w") as modified_dist:
    modified_dist.write("".join(copyright_notice) + data)
