"""
IEDC CETLY - 3D Campus Model Exporter
Converts the Blender file (coetmapf) into an optimized web-ready glTF/GLB file.

Usage:
    blender -b coetmapf -P export_model.py
or:
    python3 export_model.py (if blender is in PATH)
"""

import os
import subprocess
import sys

def run_blender_export():
    blend_file = os.path.abspath("coetmapf")
    output_glb = os.path.abspath("coetmap.glb")

    if not os.path.exists(blend_file):
        print(f"Error: Blender model file '{blend_file}' not found.")
        return False

    export_script = f"""
import bpy
print('Exporting {blend_file} to {output_glb}...')
bpy.ops.export_scene.gltf(
    filepath='{output_glb}',
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_colors=True
)
print('Export finished successfully!')
"""

    cmd = ["blender", "-b", blend_file, "--python-expr", export_script]
    print(f"Running Blender headless export...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Successfully generated: {output_glb} ({os.path.getsize(output_glb) / 1024:.1f} KB)")
        return True
    else:
        print("Blender export stderr:", res.stderr)
        print("Blender export stdout:", res.stdout)
        return False

if __name__ == "__main__":
    # Check if running inside Blender's python or standalone
    try:
        import bpy
        output_glb = os.path.abspath("coetmap.glb")
        bpy.ops.export_scene.gltf(
            filepath=output_glb,
            export_format='GLB',
            use_selection=False,
            export_apply=True
        )
        print(f"Exported successfully to {output_glb}")
    except ImportError:
        success = run_blender_export()
        sys.exit(0 if success else 1)
