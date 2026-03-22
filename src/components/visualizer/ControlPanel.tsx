import React, { useEffect } from 'react';
import { useExecutionStore } from '../../store/executionStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const ControlPanel = React.memo(() => {
  const { 
    isPlaying, playbackSpeedMs, currentIndex, states,
    play, pause, stepForward, stepBackward, jumpToStep, setSpeed, reset 
  } = useExecutionStore();

  const isFinished = states.length > 0 && currentIndex >= states.length - 1;

  // Render loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        stepForward();
      }, playbackSpeedMs);
    } else if (isFinished && isPlaying) {
      pause();
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFinished, playbackSpeedMs, stepForward, pause]);

  return (
    <Card className="p-3 flex flex-col gap-2">
      {/* Timeline Slider */}
      <div className="w-full">
        <Slider 
          min={0} 
          max={Math.max(0, states.length - 1)} 
          value={currentIndex}
          onChange={(e) => jumpToStep(Number(e.target.value))}
          disabled={states.length === 0}
          label="Execution Timeline"
          valueDisplay={states.length > 0 ? `${currentIndex + 1} / ${states.length}` : '0 / 0'}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={reset} disabled={states.length === 0 || currentIndex === 0} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={stepBackward} disabled={states.length === 0 || currentIndex === 0} title="Step Backward">
            <SkipBack className="w-4 h-4" />
          </Button>

          {isPlaying ? (
            <Button variant="primary" size="icon" className="w-12 mx-1" onClick={pause} title="Pause">
              <Pause className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="primary" size="icon" className="w-12 mx-1" onClick={play} disabled={states.length === 0 || isFinished} title="Play">
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          )}

          <Button variant="secondary" size="icon" onClick={stepForward} disabled={states.length === 0 || isFinished} title="Step Forward">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="w-full max-w-[200px] flex items-center gap-3">
          <span className="text-xs font-medium text-text-secondary w-12">Speed</span>
          <Slider 
            min={10} 
            max={1000} 
            step={10}
            // Invert the slider visually so right is faster (lower ms)
            value={1010 - playbackSpeedMs}
            onChange={(e) => setSpeed(1010 - Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>
    </Card>
  );
});
ControlPanel.displayName = 'ControlPanel';
