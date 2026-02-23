import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { initAIBlocks } from '../blocks/aiBlocks';
import { toolboxConfig } from '../blocks/toolbox';

interface BlocklyWorkspaceProps {
  onWorkspaceChange: (workspace: Blockly.WorkspaceSvg) => void;
  initialXml?: string;
}

export function BlocklyWorkspace({ onWorkspaceChange, initialXml }: BlocklyWorkspaceProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    initAIBlocks();

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxConfig,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true
    });

    workspaceRef.current = workspace;

    if (initialXml) {
      try {
        const xml = Blockly.utils.xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (error) {
        console.error('Failed to load initial XML:', error);
      }
    }

    const changeListener = () => {
      onWorkspaceChange(workspace);
    };

    workspace.addChangeListener(changeListener);

    return () => {
      workspace.removeChangeListener(changeListener);
      workspace.dispose();
    };
  }, []);

  return (
    <div
      ref={blocklyDiv}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
}
